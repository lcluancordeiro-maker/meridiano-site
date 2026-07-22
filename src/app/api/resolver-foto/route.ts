import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parsePhotoSolution } from "@/lib/photoSolve";
import { isPremiumUser } from "@/lib/entitlements";
import { localeToLanguageName } from "@/lib/localeLanguageName";
import { isLocale, type Locale } from "@/i18n/config";
import { PHOTO_SOLUTION_SCHEMA } from "@/lib/photoSolveSchema";
import { validateImageBatch } from "@/lib/photoImageLimits";
import { recordPhotoSolveHistory } from "@/lib/photoSolveHistory";

export const runtime = "nodejs";

const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 30;
type AllowedMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

function buildSystemPrompt(locale: Locale): string {
  const languageName = localeToLanguageName(locale);
  return `Você é um professor de matemática experiente, especializado em explicar
soluções passo a passo para alunos do ensino fundamental ao superior.

O usuário envia uma foto de um problema de matemática. Você deve:
1. Ler e transcrever o enunciado do problema na foto.
2. Resolver o problema com uma sequência clara de passos, cada um explicando
   o raciocínio (não pule etapas de álgebra).
3. Dar a resposta final.

Se a foto não tiver um problema de matemática legível, responda ainda assim
com "enunciado" vazio e um único passo explicando o que está faltando (ex:
"Não consegui identificar um problema de matemática nessa foto — tente
tirar a foto mais de perto, com boa iluminação.").

Às vezes o aluno envia mais de uma foto do mesmo problema — por exemplo,
quando o enunciado continua em outra página, ou uma foto mostra o
enunciado e outra mostra uma tentativa de resolução feita à mão. Trate
todas as fotos enviadas como parte de um único problema, a menos que
mostrem claramente problemas diferentes e sem relação — nesse caso,
resolva o primeiro problema legível e mencione isso no primeiro passo.

Responda sempre em ${languageName}.`;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "anthropic_not_configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form_data" }, { status: 400 });
  }

  const files = formData.getAll("image").filter((entry): entry is File => entry instanceof File);
  const validationError = validateImageBatch(files);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const localeField = formData.get("locale");
  const locale: Locale = typeof localeField === "string" && isLocale(localeField) ? localeField : "pt-BR";

  const dailyLimit = (await isPremiumUser()) ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const { error: usageError } = await supabase.rpc("increment_photo_usage", {
    p_limit: dailyLimit,
  });
  if (usageError) {
    return NextResponse.json({ error: "daily_limit_exceeded" }, { status: 429 });
  }

  const imageBlocks = await Promise.all(
    files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: file.type as AllowedMediaType,
          data: base64,
        },
      };
    })
  );
  const promptText =
    files.length > 1
      ? "Resolva o problema de matemática nestas fotos."
      : "Resolva o problema de matemática nesta foto.";

  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: buildSystemPrompt(locale),
      output_config: {
        format: { type: "json_schema", schema: PHOTO_SOLUTION_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: [...imageBlocks, { type: "text", text: promptText }],
        },
      ],
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "ai_error", message: err.message }, { status: 502 });
    }
    throw err;
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "empty_response" }, { status: 502 });
  }

  const solution = parsePhotoSolution(textBlock.text);
  await recordPhotoSolveHistory(supabase, user.id, solution);
  return NextResponse.json({ solution });
}

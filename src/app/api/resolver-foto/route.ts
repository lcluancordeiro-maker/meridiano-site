import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parsePhotoSolution } from "@/lib/photoSolve";

export const runtime = "nodejs";

const DAILY_LIMIT = 15;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
type AllowedMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const SYSTEM_PROMPT = `Você é um professor de matemática experiente, especializado em explicar
soluções passo a passo para alunos do ensino fundamental ao superior.

O usuário envia uma foto de um problema de matemática. Você deve:
1. Ler e transcrever o enunciado do problema na foto.
2. Resolver o problema com uma sequência clara de passos, cada um explicando
   o raciocínio (não pule etapas de álgebra).
3. Dar a resposta final.

Se a foto não tiver um problema de matemática legível, responda ainda assim
no formato abaixo, com "enunciado" vazio e um único passo explicando o que
está faltando (ex: "Não consegui identificar um problema de matemática
nessa foto — tente tirar a foto mais de perto, com boa iluminação.").

Responda APENAS com um objeto JSON, sem texto antes ou depois, neste formato:
{"enunciado": "...", "passos": ["...", "..."], "resposta": "..."}`;

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

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_image" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "image_too_large" }, { status: 400 });
  }

  const { error: usageError } = await supabase.rpc("increment_photo_usage", {
    p_limit: DAILY_LIMIT,
  });
  if (usageError) {
    return NextResponse.json({ error: "daily_limit_exceeded" }, { status: 429 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as AllowedMediaType,
                data: base64,
              },
            },
            { type: "text", text: "Resolva o problema de matemática nesta foto." },
          ],
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
  return NextResponse.json({ solution });
}

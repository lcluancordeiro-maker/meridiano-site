import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parsePhotoSolution } from "@/lib/photoSolve";
import { isPremiumUser } from "@/lib/entitlements";
import { localeToLanguageName } from "@/lib/localeLanguageName";
import { isLocale, type Locale } from "@/i18n/config";
import { PHOTO_SOLUTION_SCHEMA } from "@/lib/photoSolveSchema";

export const runtime = "nodejs";

// Shares the photo-solve daily quota — generating a practice problem costs
// about the same as solving one, and it's the natural continuation of the
// same flow rather than a separate feature to budget independently.
const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 30;
const MAX_ENUNCIADO_CHARS = 2000;

function buildSystemPrompt(locale: Locale): string {
  const languageName = localeToLanguageName(locale);
  return `Você é um professor de matemática experiente, especializado em criar
variações de exercícios para prática.

O aluno acabou de resolver um problema de matemática. Você deve:
1. Criar UM novo problema com a mesma habilidade e o mesmo nível de
   dificuldade do problema original, mas com números e/ou contexto
   diferentes — não repita o mesmo problema só trocando os números de forma
   óbvia.
2. Resolver seu próprio problema com uma sequência clara de passos, cada um
   explicando o raciocínio (não pule etapas de álgebra).
3. Dar a resposta final.

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

  let body: { enunciado?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const enunciado = typeof body.enunciado === "string" ? body.enunciado.trim() : "";
  if (!enunciado || enunciado.length > MAX_ENUNCIADO_CHARS) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "pt-BR";

  const dailyLimit = (await isPremiumUser()) ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const { error: usageError } = await supabase.rpc("increment_photo_usage", {
    p_limit: dailyLimit,
  });
  if (usageError) {
    return NextResponse.json({ error: "daily_limit_exceeded" }, { status: 429 });
  }

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
          content: `Problema original que o aluno resolveu: "${enunciado}"\n\nCrie um novo problema parecido, com a solução completa.`,
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

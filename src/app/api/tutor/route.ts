import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPremiumUser } from "@/lib/entitlements";
import { buildTutorSystemPrompt, type TutorContext } from "@/lib/tutor/systemPrompt";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";

const FREE_DAILY_LIMIT = 15;
const PREMIUM_DAILY_LIMIT = 60;
const MAX_MESSAGES_IN = 40;
const MAX_MESSAGES_TO_MODEL = 20;
const MAX_MESSAGE_CHARS = 4000;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(value: unknown): value is IncomingMessage {
  if (!value || typeof value !== "object") return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= MAX_MESSAGE_CHARS
  );
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

  let body: { messages?: unknown; context?: TutorContext; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES_IN) {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }
  if (!messages.every(isValidMessage)) {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }
  const validMessages = messages as IncomingMessage[];
  if (validMessages[validMessages.length - 1].role !== "user") {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }

  const dailyLimit = (await isPremiumUser()) ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const { error: usageError } = await supabase.rpc("increment_tutor_usage", {
    p_limit: dailyLimit,
  });
  if (usageError) {
    return NextResponse.json({ error: "daily_limit_exceeded" }, { status: 429 });
  }

  const recentMessages = validMessages.slice(-MAX_MESSAGES_TO_MODEL);
  const context = body.context && typeof body.context === "object" ? body.context : undefined;
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "pt-BR";

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      function send(event: { type: "delta"; text: string } | { type: "error"; error: string; message?: string }) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      }

      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          thinking: { type: "adaptive" },
          system: buildTutorSystemPrompt(context, locale),
          messages: recentMessages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "delta", text: event.delta.text });
          }
        }
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          send({ type: "error", error: "ai_error", message: err.message });
        } else {
          send({ type: "error", error: "ai_error" });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}

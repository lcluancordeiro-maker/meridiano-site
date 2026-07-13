import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPremiumUser } from "@/lib/entitlements";
import { buildTutorSystemPrompt, type TutorContext } from "@/lib/tutor/systemPrompt";

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

  let body: { messages?: unknown; context?: TutorContext };
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

  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: buildTutorSystemPrompt(context),
      messages: recentMessages.map((m) => ({ role: m.role, content: m.content })),
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

  return NextResponse.json({ reply: textBlock.text });
}

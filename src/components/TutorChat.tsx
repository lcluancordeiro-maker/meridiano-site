"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { errorMessageFor } from "@/lib/photoSolveErrors";
import { ASK_GAUSS_EVENT, GAUSS_CONTEXT_EVENT } from "@/lib/gaussPrompt";
import { extractPlottableExpression } from "@/lib/tutor/extractExpression";
import type { TutorContext, TutorMode } from "@/lib/tutor/systemPrompt";
import VoiceInputButton from "./VoiceInputButton";
import LazyFunctionGrapher from "./LazyFunctionGrapher";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function TutorChat({
  isSupabaseConfigured,
  loggedIn,
}: {
  isSupabaseConfigured: boolean;
  loggedIn: boolean;
}) {
  const { dict, locale } = useTranslation();
  const { tutor, nav } = dict;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [mode, setMode] = useState<TutorMode>("guiado");
  const [tutorContext, setTutorContextState] = useState<TutorContext | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);
  // Set once the server confirms/creates a conversation row, then reused
  // for every subsequent message in this open chat — a page reload starts
  // a new conversation rather than resuming this one (see /historico for
  // read-only access to past conversations instead).
  const conversationIdRef = useRef<string | null>(null);

  const calculatorExpression = useMemo(() => {
    const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")?.content;
    return lastAssistantMessage ? extractPlottableExpression(lastAssistantMessage) : "x^2";
  }, [messages]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    function handleAskGauss(event: Event) {
      const prompt = (event as CustomEvent<string>).detail;
      if (prompt) {
        setInput(prompt);
        setOpen(true);
      }
    }
    window.addEventListener(ASK_GAUSS_EVENT, handleAskGauss);
    return () => window.removeEventListener(ASK_GAUSS_EVENT, handleAskGauss);
  }, []);

  useEffect(() => {
    function handleContext(event: Event) {
      setTutorContextState((event as CustomEvent<TutorContext | undefined>).detail);
    }
    window.addEventListener(GAUSS_CONTEXT_EVENT, handleContext);
    return () => window.removeEventListener(GAUSS_CONTEXT_EVENT, handleContext);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          locale,
          context: tutorContext,
          conversationId: conversationIdRef.current ?? undefined,
          mode,
        }),
      });

      if (!res.ok || !res.body) {
        let errorCode: string | undefined;
        try {
          errorCode = (await res.json())?.error;
        } catch {
          // response wasn't JSON — fall through with no error code
        }
        setError(errorMessageFor(dict, errorCode));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let streamErrorCode: string | undefined;
      let assistantMessageAdded = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const streamEvent = JSON.parse(line) as
            | { type: "delta"; text: string }
            | { type: "error"; error: string }
            | { type: "conversation_id"; id: string };

          if (streamEvent.type === "delta") {
            assistantText += streamEvent.text;
            if (!assistantMessageAdded) {
              assistantMessageAdded = true;
              setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
            } else {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantText };
                return updated;
              });
            }
          } else if (streamEvent.type === "conversation_id") {
            conversationIdRef.current = streamEvent.id;
          } else {
            streamErrorCode = streamEvent.error;
          }
        }
      }

      if (streamErrorCode) {
        setError(errorMessageFor(dict, streamErrorCode));
      }
    } catch {
      setError(errorMessageFor(dict, undefined));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tutor.openButtonLabel}
        className="fixed bottom-4 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        🧮
      </button>
    );
  }

  const canChat = isSupabaseConfigured && loggedIn;

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 flex w-auto flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:inset-x-auto sm:left-4 sm:w-96 ${
        canChat ? "h-[70vh] max-h-[560px]" : "h-auto"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">{tutor.title}</p>
          <p className="text-xs text-muted">{tutor.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={tutor.closeButtonLabel}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-background hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {!isSupabaseConfigured ? (
        <p className="p-4 text-sm text-muted">{tutor.notConfigured}</p>
      ) : !loggedIn ? (
        <p className="p-4 text-sm text-muted">
          <Link href="/entrar" className="font-semibold text-primary hover:underline">
            {tutor.requiresLogin}
          </Link>
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
            <button
              type="button"
              onClick={() => setShowCalculator((v) => !v)}
              aria-pressed={showCalculator}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                showCalculator ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              <span aria-hidden>📈</span>
              {nav.calculadora}
            </button>
            <div
              className="flex items-center gap-0.5 rounded-lg bg-background p-0.5"
              role="group"
              title={tutor.modeToggleLabel}
            >
              <button
                type="button"
                onClick={() => setMode("guiado")}
                aria-pressed={mode === "guiado"}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                  mode === "guiado" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                {tutor.modeGuiado}
              </button>
              <button
                type="button"
                onClick={() => setMode("direto")}
                aria-pressed={mode === "direto"}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                  mode === "direto" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                {tutor.modeDireto}
              </button>
            </div>
          </div>

          {showCalculator && (
            <div className="max-h-72 shrink-0 overflow-y-auto border-b border-border p-3">
              <LazyFunctionGrapher initialExpressions={[calculatorExpression]} key={calculatorExpression} />
            </div>
          )}

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <div className="mb-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm text-foreground">
              {tutor.welcomeMessage}
            </div>
            {messages.map((message, i) => (
              <div
                key={i}
                className={`mb-3 max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto rounded-tr-sm bg-primary text-white"
                    : "rounded-tl-sm bg-background text-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="mb-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm text-muted">
                {tutor.thinking}
              </div>
            )}
            {error && <p className="text-sm text-error">{error}</p>}
          </div>

          <div className="flex items-end gap-2 border-t border-border p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tutor.placeholder}
              rows={1}
              className="max-h-24 flex-1 resize-none rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <VoiceInputButton
              locale={locale}
              label={tutor.voiceInputLabel}
              listeningLabel={tutor.voiceListeningLabel}
              onResult={(transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {tutor.sendButton}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { errorMessageFor } from "@/lib/photoSolveErrors";
import { ASK_GAUSS_EVENT } from "@/lib/gaussPrompt";
import VoiceInputButton from "./VoiceInputButton";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function TutorChat({
  isSupabaseConfigured,
  loggedIn,
}: {
  isSupabaseConfigured: boolean;
  loggedIn: boolean;
}) {
  const { dict, locale } = useTranslation();
  const { tutor } = dict;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(errorMessageFor(dict, data?.error));
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
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
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3">
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

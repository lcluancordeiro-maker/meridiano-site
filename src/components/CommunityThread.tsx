"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { reportMessage } from "@/app/actions/moderation";
import { useTranslation } from "@/i18n/LanguageContext";

type Message = { id: string; sender_id: string; body: string; created_at: string };

export default function CommunityThread({
  communityId,
  currentUserId,
  initialMessages,
  memberNames,
}: {
  communityId: string;
  currentUserId: string;
  initialMessages: Message[];
  memberNames: Record<string, string>;
}) {
  const { dict } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleReport(messageId: string) {
    setReportedIds((prev) => new Set(prev).add(messageId));
    await reportMessage("community_messages", messageId);
  }

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`community:${communityId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages", filter: `community_id=eq.${communityId}` },
        (payload) => {
          const row = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    const supabase = createClient();
    if (!supabase) return;

    setSending(true);
    const { error } = await supabase.from("community_messages").insert({
      community_id: communityId,
      sender_id: currentUserId,
      body,
    });
    setSending(false);
    if (!error) setDraft("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">{dict.chat.noMessagesYet}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <li key={message.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && (
                    <span className="mb-1 text-xs font-medium text-muted">{memberNames[message.sender_id] ?? "?"}</span>
                  )}
                  <p
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      isOwn ? "rounded-tr-sm bg-primary text-white" : "rounded-tl-sm bg-background text-foreground"
                    }`}
                  >
                    {message.body}
                  </p>
                  {!isOwn && (
                    <button
                      type="button"
                      onClick={() => handleReport(message.id)}
                      disabled={reportedIds.has(message.id)}
                      className="mt-1 text-xs text-muted hover:text-error disabled:cursor-not-allowed"
                    >
                      {reportedIds.has(message.id) ? dict.chat.reportedConfirmation : dict.chat.reportButton}
                    </button>
                  )}
                </li>
              );
            })}
            <div ref={bottomRef} />
          </ul>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={dict.chat.messagePlaceholder}
          className="flex-1 rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.chat.sendButton}
        </button>
      </form>
    </div>
  );
}

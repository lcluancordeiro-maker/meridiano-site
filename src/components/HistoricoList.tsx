"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { getConversationMessages, type HistoryMessage } from "@/app/actions/historico";
import type { PhotoSolution } from "@/lib/photoSolve";
import type { Locale } from "@/i18n/config";

type ConversationRow = { id: string; title: string; updated_at: string };
type PhotoHistoryRow = { id: string; created_at: string } & PhotoSolution;

export default function HistoricoList({
  conversations,
  photoHistory,
  locale,
}: {
  conversations: ConversationRow[];
  photoHistory: PhotoHistoryRow[];
  locale: Locale;
}) {
  const { dict } = useTranslation();
  const { historico, solution } = dict;
  const [openConversationId, setOpenConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(null);

  async function toggleConversation(id: string) {
    if (openConversationId === id) {
      setOpenConversationId(null);
      return;
    }
    setOpenConversationId(id);
    setLoadingMessages(true);
    setMessages(await getConversationMessages(id));
    setLoadingMessages(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-lg font-semibold text-foreground">{historico.conversasHeading}</h2>
        {conversations.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{historico.semConversas}</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {conversations.map((c) => (
              <li key={c.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted">{formatDate(c.updated_at)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleConversation(c.id)}
                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    {openConversationId === c.id ? historico.fecharMensagens : historico.verMensagens}
                  </button>
                </div>
                {openConversationId === c.id && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                    {loadingMessages ? (
                      <p className="text-sm text-muted">{historico.carregando}</p>
                    ) : (
                      messages.map((m, i) => (
                        <div
                          key={i}
                          className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                            m.role === "user"
                              ? "ml-auto rounded-tr-sm bg-primary text-white"
                              : "rounded-tl-sm bg-background text-foreground"
                          }`}
                        >
                          {m.content}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">{historico.fotosHeading}</h2>
        {photoHistory.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{historico.semFotos}</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {photoHistory.map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{p.enunciado}</p>
                  <button
                    type="button"
                    onClick={() => setOpenPhotoId((prev) => (prev === p.id ? null : p.id))}
                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    {openPhotoId === p.id ? historico.fecharMensagens : historico.verMensagens}
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted">{formatDate(p.created_at)}</p>
                {openPhotoId === p.id && (
                  <div className="mt-3 border-t border-border pt-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {solution.passoAPasso}
                    </h3>
                    <ol className="mt-2 flex flex-col gap-2">
                      {p.passos.map((passo, i) => (
                        <li key={i} className="flex gap-3 text-sm text-foreground">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{passo}</span>
                        </li>
                      ))}
                    </ol>
                    {p.resposta && (
                      <div className="mt-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                          {solution.resposta}
                        </h3>
                        <p className="mt-1 font-semibold text-foreground">{p.resposta}</p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

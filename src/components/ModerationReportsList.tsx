"use client";

import { useState, useTransition } from "react";
import { actionTakenReport, banUserFromSocial, dismissReport, unbanUserFromSocial } from "@/app/actions/admin";

export type ModerationReport = {
  report_id: string;
  message_table: "dm_messages" | "community_messages";
  message_id: string;
  context_id: string | null;
  body: string | null;
  sender_id: string | null;
  sender_name: string | null;
  reporter_id: string;
  reporter_name: string | null;
  status: "pending" | "dismissed" | "action_taken";
  created_at: string;
};

const STATUS_LABEL: Record<ModerationReport["status"], string> = {
  pending: "Pendente",
  dismissed: "Dispensada",
  action_taken: "Ação tomada",
};

export default function ModerationReportsList({
  initialReports,
  initialBannedSenderIds,
}: {
  initialReports: ModerationReport[];
  initialBannedSenderIds: string[];
}) {
  const [reports, setReports] = useState(initialReports);
  const [bannedIds, setBannedIds] = useState(new Set(initialBannedSenderIds));
  const [pending, startTransition] = useTransition();

  function updateStatus(reportId: string, status: ModerationReport["status"]) {
    setReports((prev) => prev.map((r) => (r.report_id === reportId ? { ...r, status } : r)));
  }

  function handleDismiss(reportId: string) {
    startTransition(async () => {
      await dismissReport(reportId);
      updateStatus(reportId, "dismissed");
    });
  }

  function handleActionTaken(reportId: string) {
    startTransition(async () => {
      await actionTakenReport(reportId);
      updateStatus(reportId, "action_taken");
    });
  }

  function handleBan(senderId: string) {
    startTransition(async () => {
      await banUserFromSocial(senderId, "Denúncia de mensagem no painel de moderação");
      setBannedIds((prev) => new Set(prev).add(senderId));
    });
  }

  function handleUnban(senderId: string) {
    startTransition(async () => {
      await unbanUserFromSocial(senderId);
      setBannedIds((prev) => {
        const next = new Set(prev);
        next.delete(senderId);
        return next;
      });
    });
  }

  if (reports.length === 0) {
    return <p className="text-sm text-muted">Nenhuma denúncia por enquanto.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {reports.map((r) => (
        <li key={r.report_id} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {r.message_table === "dm_messages" ? "Chat" : "Comunidade"} — denunciado por {r.reporter_name ?? "?"}
            </span>
            <span className={r.status === "pending" ? "font-semibold text-warning" : "text-muted"}>
              {STATUS_LABEL[r.status]}
            </span>
          </div>
          <p className="mt-2 text-sm text-foreground">
            <span className="font-semibold">{r.sender_name ?? "?"}:</span> {r.body ?? "(mensagem removida)"}
          </p>
          {r.status === "pending" && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => handleDismiss(r.report_id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Dispensar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleActionTaken(r.report_id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Marcar ação tomada
              </button>
              {r.sender_id &&
                (bannedIds.has(r.sender_id) ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleUnban(r.sender_id!)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Desbanir remetente
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleBan(r.sender_id!)}
                    className="rounded-lg border border-error px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error-bg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Banir remetente dos recursos sociais
                  </button>
                ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

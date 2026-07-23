"use client";

import { useState } from "react";
import { reportContent, type ReportSource } from "@/app/actions/contentReports";

/** "Reportar erro" — a lightweight escape hatch for a student who notices
 * something wrong in an exercise or an AI response. Reused by
 * ExerciseQuiz.tsx (source: "exercicio") and SolutionDisplay.tsx (source:
 * "gauss", for both the tutor chat and photo-solve). Reports land in
 * content_reports for manual review (see /admin/relatos-conteudo) — this
 * component only has to fire-and-confirm, not triage. */
export default function ReportContentButton({
  source,
  levelId,
  topicId,
  exerciseId,
  difficulty,
  context,
}: {
  source: ReportSource;
  levelId?: string;
  topicId?: string;
  exerciseId?: string;
  difficulty?: string;
  context?: string;
}) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit() {
    setStatus("sending");
    const result = await reportContent({ source, levelId, topicId, exerciseId, difficulty, context, comment });
    setStatus(result.ok ? "sent" : "idle");
  }

  if (status === "sent") {
    return <p className="text-xs text-muted">Obrigado! Vamos revisar.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-xs font-medium text-muted underline-offset-2 hover:text-foreground hover:underline"
      >
        Reportar erro
      </button>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="O que parece errado? (opcional)"
        rows={2}
        className="w-full rounded-lg border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState, useTransition } from "react";
import { DIFFICULTY_LABELS, type Difficulty } from "@/data/curriculum";
import {
  deleteCommunityProblem,
  submitCommunityProblem,
  toggleProblemUpvote,
} from "@/app/actions/communityProblems";
import ReportContentButton from "./ReportContentButton";

export type CommunityProblem = {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
  topic_tag: string;
  difficulty: Difficulty;
  upvotes: number;
  author_name: string;
  is_own: boolean;
  already_upvoted: boolean;
  created_at: string;
};

// Hardcoded Portuguese — same convention as other recently-added
// interactive controls (ReportContentButton.tsx, FriendsLeague.tsx) that
// ship before full 15-locale i18n.
export default function CommunityProblemsList({
  initialProblems,
}: {
  initialProblems: CommunityProblem[];
}) {
  const [state, formAction, pending] = useActionState(submitCommunityProblem, undefined);
  const [problems, setProblems] = useState(initialProblems);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function handleUpvote(id: string) {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, already_upvoted: !p.already_upvoted, upvotes: p.upvotes + (p.already_upvoted ? -1 : 1) }
          : p
      )
    );
    startTransition(async () => {
      await toggleProblemUpvote(id);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCommunityProblem(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <form action={formAction} className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">Enviar um problema</h2>
        <div className="mt-3 flex flex-col gap-3">
          <textarea
            name="prompt"
            required
            placeholder="Enunciado do problema"
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="answer"
              required
              placeholder="Resposta"
              className="rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <input
              name="topicTag"
              required
              placeholder="Assunto (ex: Frações, ENEM)"
              className="rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <textarea
            name="explanation"
            placeholder="Explicação (opcional)"
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <select
            name="difficulty"
            required
            defaultValue=""
            className="w-fit rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="" disabled>
              Nível de dificuldade
            </option>
            {(["facil", "medio", "dificil", "olimpiada"] as Difficulty[]).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABELS[d]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
        {state?.error && <p className="mt-2 text-sm text-error">{state.error}</p>}
        {state?.success && <p className="mt-2 text-sm text-success">{state.success}</p>}
      </form>

      {problems.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          Nenhum problema enviado ainda — seja o primeiro!
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {problems.map((problem) => {
            const isRevealed = revealed.has(problem.id);
            return (
              <li key={problem.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {problem.topic_tag}
                  </span>
                  <span>{DIFFICULTY_LABELS[problem.difficulty]}</span>
                  <span>· enviado por {problem.author_name}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm font-medium text-foreground">
                  {problem.prompt}
                </p>

                {isRevealed && (
                  <div className="mt-3 rounded-xl bg-background p-3 text-sm">
                    <p className="font-semibold text-foreground">Resposta: {problem.answer}</p>
                    {problem.explanation && (
                      <p className="mt-1 text-muted">{problem.explanation}</p>
                    )}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleReveal(problem.id)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {isRevealed ? "Esconder resposta" : "Ver resposta"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpvote(problem.id)}
                    aria-pressed={problem.already_upvoted}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      problem.already_upvoted
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted hover:border-primary/50"
                    }`}
                  >
                    👍 {problem.upvotes}
                  </button>
                  {problem.is_own && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(problem.id)}
                      className="text-xs font-medium text-muted hover:text-error"
                    >
                      Excluir
                    </button>
                  )}
                  <ReportContentButton source="community_problem" context={problem.prompt.slice(0, 200)} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

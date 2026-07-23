"use client";

import { useState } from "react";

/** Turns an "explore" widget into an answer-bearing interaction: the card
 * states a target ("monte a reta f(x) = -2x + 3…") and grades the widget's
 * live state when the student clicks "Verificar desafio" — the interaction
 * IS the question, Brilliant.org-style. The parent widget computes `isMet`
 * from its own sliders/state. No XP or progress tracking, like the theory
 * check questions. */
export default function WidgetChallenge({ goal, isMet }: { goal: string; isMet: boolean }) {
  const [status, setStatus] = useState<"pending" | "wrong" | "solved">("pending");

  if (status === "solved") {
    return (
      <div
        className="animate-rise-in mt-4 rounded-xl border border-success bg-success-bg p-3"
        data-testid="widget-challenge"
      >
        <p className="text-sm font-semibold text-success">Desafio concluído! 🎉</p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-xl border border-accent/50 bg-accent/5 p-3"
      data-testid="widget-challenge"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Desafio</p>
      <p className="mt-1 text-sm font-medium text-foreground">{goal}</p>
      <div className="mt-2 flex items-center gap-3">
        {/* "Conferir", not "Verificar": the quiz's own "Verificar" button lives
            on the same page, and Playwright's getByRole name matching is a
            substring match by default — "Verificar desafio" would make every
            existing { name: "Verificar" } selector ambiguous. */}
        <button
          onClick={() => setStatus(isMet ? "solved" : "wrong")}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Conferir desafio
        </button>
        {status === "wrong" && (
          <p className="animate-rise-in text-sm font-medium text-error">
            Ainda não — continue ajustando.
          </p>
        )}
      </div>
    </div>
  );
}

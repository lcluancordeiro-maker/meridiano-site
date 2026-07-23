"use client";

import { useState } from "react";
import type { ExerciseStep } from "@/data/curriculum";

/** Collapsible Brilliant-style scaffolding for a harder exercise: the
 * student can expand "Resolver em etapas" and answer one-tap sub-steps
 * revealed one at a time, each with immediate feedback. The panel never
 * gates the real answer UI — the final answer stays the only graded part,
 * so solving directly (and every data-driven e2e test) keeps working. */
export default function GuidedSteps({ steps }: { steps: ExerciseStep[] }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<(string | null)[]>(() => steps.map(() => null));

  const answeredCount = picked.filter((p) => p !== null).length;
  const visibleSteps = Math.min(answeredCount + 1, steps.length);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 self-start rounded-lg border border-primary/40 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        Resolver em etapas
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3" data-testid="guided-steps">
      {steps.slice(0, visibleSteps).map((step, i) => {
        const pick = picked[i];
        const answered = pick !== null;
        const isCorrect = pick === step.answer;
        return (
          <div key={i} className="animate-rise-in rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Etapa {i + 1} de {steps.length}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{step.prompt}</p>
            <div className="mt-2 flex flex-col gap-2">
              {step.options.map((option) => {
                const showCorrect = answered && option === step.answer;
                const showWrong = answered && pick === option && !showCorrect;
                return (
                  <button
                    key={option}
                    disabled={answered}
                    onClick={() => setPicked((prev) => prev.map((v, j) => (j === i ? option : v)))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all enabled:active:scale-[0.98] ${
                      showCorrect
                        ? "border-success bg-success-bg text-success"
                        : showWrong
                        ? "border-error bg-error-bg text-error"
                        : "border-border bg-surface text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p
                className={`animate-rise-in mt-2 text-sm leading-relaxed ${
                  isCorrect ? "text-success" : "text-error"
                }`}
              >
                {isCorrect ? "Isso!" : `Na verdade: ${step.answer}.`} {step.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

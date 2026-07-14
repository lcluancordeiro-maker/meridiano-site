"use client";

import { useState } from "react";
import type { CheckQuestion } from "@/data/curriculum";

/** Inline comprehension check shown right after a theory section — one tap
 * on an option grades it immediately (no separate "Verificar" step, unlike
 * ExerciseQuiz) and shows the explanation. No XP or progress tracking. */
export default function TheoryCheckQuestion({ question }: { question: CheckQuestion }) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const isCorrect = picked === question.answer;

  return (
    <div
      className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5"
      data-testid="theory-check"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Verifique se entendeu
      </p>
      <p className="mt-2 font-display text-base font-medium text-foreground">{question.prompt}</p>
      <div className="mt-3 flex flex-col gap-2">
        {question.options.map((option) => {
          const showCorrect = answered && option === question.answer;
          const showWrong = answered && picked === option && !showCorrect;
          return (
            <button
              key={option}
              disabled={answered}
              onClick={() => setPicked(option)}
              className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                showCorrect
                  ? "border-success bg-success-bg text-success"
                  : showWrong
                  ? "border-error bg-error-bg text-error"
                  : "border-border bg-surface text-foreground hover:border-primary/50"
              } disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={`mt-3 rounded-xl p-3 text-sm leading-relaxed ${
            isCorrect ? "bg-success-bg text-success" : "bg-error-bg text-error"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "Certinho!" : `Resposta correta: ${question.answer}`}
          </p>
          <p className="mt-1 text-foreground/80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

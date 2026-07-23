"use client";

import { useState } from "react";
import type { Flashcard } from "@/data/curriculum";

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];
  const isLast = index === cards.length - 1;

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted">
        {index + 1} de {cards.length}
      </p>
      <button
        type="button"
        data-testid="flashcard"
        onClick={() => setFlipped((v) => !v)}
        aria-label={flipped ? "Ver frente do cartão" : "Virar cartão"}
        className="flex min-h-40 w-full max-w-md items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-colors hover:border-primary"
      >
        <span className={flipped ? "text-base text-foreground" : "font-display text-xl font-semibold text-foreground"}>
          {flipped ? card.back : card.front}
        </span>
      </button>
      <p className="text-xs text-muted">{flipped ? "Toque para ver a frente" : "Toque para virar"}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={() => goTo(0)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Recomeçar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}

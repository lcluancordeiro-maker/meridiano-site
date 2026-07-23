"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const INITIAL: number[] = [5, 2, 8, 1, 9, 3];

type SortState = {
  array: number[];
  i: number;
  j: number;
  comparisons: number;
  swaps: number;
  done: boolean;
};

function initialState(): SortState {
  return { array: [...INITIAL], i: 0, j: 0, comparisons: 0, swaps: 0, done: false };
}

function step(state: SortState): SortState {
  if (state.done) return state;
  const { array, i, j } = state;
  const passLength = array.length - 1 - i;
  const newArray = [...array];
  let swaps = state.swaps;

  if (newArray[j] > newArray[j + 1]) {
    [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
    swaps += 1;
  }

  let nextI = i;
  let nextJ = j + 1;
  if (nextJ >= passLength) {
    nextJ = 0;
    nextI = i + 1;
  }

  return {
    array: newArray,
    i: nextI,
    j: nextJ,
    comparisons: state.comparisons + 1,
    swaps,
    done: nextI >= array.length - 1,
  };
}

export default function BubbleSortExplorer() {
  const [state, setState] = useState<SortState>(initialState);

  const settledFrom = state.array.length - state.i;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {state.done ? "Ordenado! 🎉" : `Comparando as posições ${state.j + 1} e ${state.j + 2}`}
      </p>
      <p className="mt-1 text-sm text-muted">
        Comparações: {state.comparisons} · Trocas: {state.swaps}
      </p>

      <div
        className="mt-4 flex items-end justify-center gap-2"
        role="img"
        aria-label={`Vetor [${state.array.join(", ")}], ${state.done ? "ordenado" : `comparando posições ${state.j + 1} e ${state.j + 2}`}`}
      >
        {state.array.map((value, idx) => {
          const isComparing = !state.done && (idx === state.j || idx === state.j + 1);
          const isSettled = state.done || idx >= settledFrom;
          return (
            <div
              key={idx}
              className={`flex w-10 flex-col items-center justify-end rounded-t-lg border-2 text-sm font-semibold ${
                isComparing
                  ? "border-accent bg-accent/20 text-foreground"
                  : isSettled
                    ? "border-success bg-success-bg text-success"
                    : "border-border bg-background text-foreground"
              }`}
              style={{ height: `${20 + value * 8}px` }}
            >
              <span className="pb-1">{value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setState((s) => step(s))}
          disabled={state.done}
          aria-label="Próximo passo"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          Próximo passo
        </button>
        <button
          onClick={() => setState(initialState())}
          aria-label="Reiniciar"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          Reiniciar
        </button>
      </div>

      <WidgetChallenge
        goal="Clique em 'Próximo passo' até o vetor ficar totalmente ordenado."
        isMet={state.done}
      />
    </div>
  );
}

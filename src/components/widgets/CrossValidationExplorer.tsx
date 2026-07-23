"use client";

import { useState } from "react";

const DATASET_SIZE = 12;
const K_OPTIONS = [2, 3, 4, 6];
const CELL = 20;
const GAP = 4;

export default function CrossValidationExplorer() {
  const [k, setK] = useState(4);
  const [testFold, setTestFold] = useState(0);

  const foldSize = DATASET_SIZE / k;
  const trainSize = DATASET_SIZE - foldSize;

  function selectK(next: number) {
    setK(next);
    setTestFold(0);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        k={k} → cada fold tem {foldSize} exemplos · fold de teste: {testFold + 1} de {k} · treino: {trainSize}{" "}
        exemplos
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">k:</span>
        {K_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => selectK(option)}
            aria-pressed={option === k}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              option === k
                ? "bg-primary text-white"
                : "border border-border bg-surface text-foreground hover:bg-background"
            }`}
          >
            {option}
          </button>
        ))}
        <button
          onClick={() => setTestFold((f) => (f + 1) % k)}
          className="ml-auto rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
        >
          Próximo fold →
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${DATASET_SIZE * (CELL + GAP)} ${CELL + 4}`}
          className="h-8 w-full"
          role="img"
          aria-label={`Dataset de ${DATASET_SIZE} exemplos dividido em ${k} folds de ${foldSize}; fold de teste atual: ${testFold + 1}`}
        >
          {Array.from({ length: DATASET_SIZE }, (_, i) => {
            const foldIndex = Math.floor(i / foldSize);
            const isTest = foldIndex === testFold;
            const x = i * (CELL + GAP);
            return (
              <rect
                key={i}
                x={x}
                y={0}
                width={CELL}
                height={CELL}
                rx={4}
                fill={isTest ? "#e34948" : "#2a78d6"}
                fillOpacity={isTest ? 0.85 : 0.4}
              />
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Vermelho: fold de teste na rodada atual. Azul: folds de treino. Clique em &quot;Próximo fold&quot; para
        percorrer as {k} rodadas do k-fold; a métrica final é a média das {k} avaliações.
      </p>
    </div>
  );
}

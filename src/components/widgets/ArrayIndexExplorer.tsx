"use client";

import { useState } from "react";

const ARRAY = [10, 20, 30, 40, 50];
const CELL = 50;
const GAP = 6;

export default function ArrayIndexExplorer() {
  const [index, setIndex] = useState(2);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        v[{index}] = {ARRAY[index - 1]}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">Índice: {index}</span>
          <input
            type="range"
            min={1}
            max={ARRAY.length}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Índice do vetor"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${ARRAY.length * (CELL + GAP)} ${CELL + 24}`}
          className="h-24 w-full"
          role="img"
          aria-label={`Vetor v com 5 elementos; v[${index}] destacado, valor ${ARRAY[index - 1]}`}
        >
          {ARRAY.map((value, i) => {
            const highlighted = i + 1 === index;
            const x = i * (CELL + GAP);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={0}
                  width={CELL}
                  height={CELL}
                  rx={6}
                  fill={highlighted ? "#2a78d6" : "var(--color-border)"}
                  fillOpacity={highlighted ? 0.25 : 1}
                  stroke={highlighted ? "#2a78d6" : "var(--color-muted)"}
                  strokeWidth={highlighted ? 2 : 1}
                />
                <text x={x + CELL / 2} y={CELL / 2 + 5} fontSize={16} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
                  {value}
                </text>
                <text x={x + CELL / 2} y={CELL + 16} fontSize={11} fill="var(--color-muted)" textAnchor="middle">
                  v[{i + 1}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">v ← [10, 20, 30, 40, 50] — arraste o índice para percorrer o vetor.</p>
    </div>
  );
}

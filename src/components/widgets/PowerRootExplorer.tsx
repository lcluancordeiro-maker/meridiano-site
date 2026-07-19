"use client";

import { useState } from "react";

const CELL = 22;
const GAP = 2;
const MAX_N = 10;

export default function PowerRootExplorer() {
  const [n, setN] = useState(4);

  const square = n * n;
  const size = n * (CELL + GAP) - GAP;

  const cells: { row: number; col: number }[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      cells.push({ row, col });
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {n}² = {square} · √{square} = {n}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Lado do quadrado (n): {n}</span>
          <input
            type="range"
            min={1}
            max={MAX_N}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Lado do quadrado, n"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-center overflow-hidden rounded-xl border border-border bg-white p-4">
        <svg
          viewBox={`0 0 ${MAX_N * (CELL + GAP)} ${MAX_N * (CELL + GAP)}`}
          width={size}
          height={size}
          role="img"
          aria-label={`Quadrado de lado ${n}, formado por ${square} quadradinhos unitários: n² = ${square}`}
        >
          {cells.map(({ row, col }) => (
            <rect
              key={`${row}-${col}`}
              x={col * (CELL + GAP)}
              y={row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill="#2a78d6"
              fillOpacity={0.25}
              stroke="#2a78d6"
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>
      <p className="mt-3 text-sm text-foreground">
        A área do quadrado de lado {n} tem {square} quadradinhos — por isso {n}² = {square}, e o caminho
        inverso, a raiz quadrada, devolve o lado: √{square} = {n}.
      </p>
    </div>
  );
}

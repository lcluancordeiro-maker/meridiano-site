"use client";

import { useState } from "react";
import { clamp } from "./svgUtils";

const TEXT = "matematica";
const CELL = 32;
const GAP = 3;

export default function StringIndexExplorer() {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(4);

  const clampedEnd = clamp(end, start, TEXT.length);
  const substring = TEXT.slice(start - 1, clampedEnd);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        tamanho(s) = {TEXT.length} · subcadeia(s, {start}, {clampedEnd}) = &quot;{substring}&quot;
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">Início: {start}</span>
          <input
            type="range"
            min={1}
            max={TEXT.length}
            step={1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Posição inicial da subcadeia"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">Fim: {clampedEnd}</span>
          <input
            type="range"
            min={start}
            max={TEXT.length}
            step={1}
            value={clampedEnd}
            onChange={(e) => setEnd(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Posição final da subcadeia"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${TEXT.length * (CELL + GAP)} ${CELL + 20}`}
          className="h-16 w-full"
          role="img"
          aria-label={`String "${TEXT}" com as posições ${start} a ${clampedEnd} destacadas, formando "${substring}"`}
        >
          {TEXT.split("").map((char, i) => {
            const highlighted = i + 1 >= start && i + 1 <= clampedEnd;
            const x = i * (CELL + GAP);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={0}
                  width={CELL}
                  height={CELL}
                  rx={4}
                  fill={highlighted ? "#2a78d6" : "var(--color-border)"}
                  fillOpacity={highlighted ? 0.25 : 1}
                  stroke={highlighted ? "#2a78d6" : "var(--color-muted)"}
                  strokeWidth={highlighted ? 2 : 1}
                />
                <text x={x + CELL / 2} y={CELL / 2 + 6} fontSize={15} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
                  {char}
                </text>
                <text x={x + CELL / 2} y={CELL + 14} fontSize={9} fill="var(--color-muted)" textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">s ← &quot;{TEXT}&quot; — mexa no início e no fim para recortar a subcadeia.</p>
    </div>
  );
}

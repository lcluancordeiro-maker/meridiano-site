"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 200;
const MARGIN = 24;
const N_TERMS = 15;

export default function SequenceConvergenceExplorer() {
  const [epsilon, setEpsilon] = useState(0.2);

  const nThreshold = Math.ceil(1 / epsilon);

  function toX(n: number): number {
    return MARGIN + ((n - 1) / (N_TERMS - 1)) * (WIDTH - 2 * MARGIN);
  }
  function toY(value: number): number {
    return HEIGHT - MARGIN - value * (HEIGHT - 2 * MARGIN);
  }

  const points = Array.from({ length: N_TERMS }, (_, i) => {
    const n = i + 1;
    const value = 1 / n;
    return { n, value, inBand: value < epsilon };
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        aₙ = 1/n → L = 0 · ε = {epsilon.toFixed(2)} · N = {nThreshold}
      </p>
      <p className="mt-1 text-sm text-muted">
        A partir de n = {nThreshold + 1}, todo termo satisfaz |aₙ − 0| &lt; ε.
      </p>

      <div className="mt-4">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">ε: {epsilon.toFixed(2)}</span>
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.05}
            value={epsilon}
            onChange={(e) => setEpsilon(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor de épsilon"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-48 w-full"
          role="img"
          aria-label={`Termos da sequência aₙ=1/n para n de 1 a ${N_TERMS}, com faixa de tolerância épsilon=${epsilon.toFixed(2)} ao redor do limite 0. A partir de n=${nThreshold + 1} todos os termos ficam dentro da faixa.`}
        >
          <rect
            x={MARGIN}
            y={toY(epsilon)}
            width={WIDTH - 2 * MARGIN}
            height={toY(0) - toY(epsilon)}
            fill="#1baf7a"
            fillOpacity={0.15}
          />
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={toY(0)} y2={toY(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={toY(epsilon)} y2={toY(epsilon)} stroke="#1baf7a" strokeWidth={1.5} strokeDasharray="4 3" />

          {points.map((p) => (
            <circle
              key={p.n}
              cx={toX(p.n)}
              cy={toY(p.value)}
              r={4}
              fill={p.inBand ? "#1baf7a" : "#e34948"}
            />
          ))}
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste ε até que N (o índice a partir do qual todos os termos ficam dentro da faixa) seja igual a 5 (dica: ε=0,20)."
        isMet={nThreshold === 5}
      />
    </div>
  );
}

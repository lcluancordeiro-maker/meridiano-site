"use client";

import { useState } from "react";

const WIDTH = 300;
const HEIGHT = 60;

export default function ProportionPercentExplorer() {
  const [percent, setPercent] = useState(30);
  const [total, setTotal] = useState(120);

  const part = (percent / 100) * total;
  const partWidth = (percent / 100) * WIDTH;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {percent}% de {total} = {part}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Porcentagem: {percent}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Porcentagem a calcular"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Total: {total}</span>
          <input
            type="range"
            min={10}
            max={200}
            step={10}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor total (o todo)"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-14 w-full"
          role="img"
          aria-label={`Barra representando o total ${total}, com ${percent}% (${part}) destacado`}
        >
          <rect x={0} y={10} width={WIDTH} height={30} rx={6} fill="var(--color-border)" />
          <rect x={0} y={10} width={partWidth} height={30} rx={6} fill="#2a78d6" />
          <text x={WIDTH / 2} y={54} fontSize={11} fill="var(--color-muted)" textAnchor="middle">
            parte destacada = {percent}% do total
          </text>
        </svg>
      </div>
    </div>
  );
}

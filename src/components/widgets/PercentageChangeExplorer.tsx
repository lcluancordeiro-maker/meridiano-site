"use client";

import { useState } from "react";

const WIDTH = 300;
const HEIGHT = 180;
const MARGIN_BOTTOM = 28;
const BAR_WIDTH = 60;
const GAP = 30;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function PercentageChangeExplorer() {
  const [original, setOriginal] = useState(100);
  const [percent1, setPercent1] = useState(20);
  const [percent2, setPercent2] = useState(-10);

  const afterFirst = original * (1 + percent1 / 100);
  const afterSecond = afterFirst * (1 + percent2 / 100);

  const maxValue = Math.max(original, afterFirst, afterSecond, 1);
  const plotHeight = HEIGHT - MARGIN_BOTTOM - 10;

  function barHeight(value: number): number {
    return (value / maxValue) * plotHeight;
  }

  const bars = [
    { label: "Original", value: original, color: "var(--color-muted)" },
    { label: `Após ${percent1 >= 0 ? "+" : ""}${percent1}%`, value: afterFirst, color: "#2a78d6" },
    { label: `Após ${percent2 >= 0 ? "+" : ""}${percent2}%`, value: afterSecond, color: "#1baf7a" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        R$ {original} → R$ {formatCurrency(afterSecond)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Valor original: R$ {original}</span>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={original}
            onChange={(e) => setOriginal(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">1ª variação: {percent1}%</span>
          <input
            type="range"
            min={-50}
            max={50}
            step={5}
            value={percent1}
            onChange={(e) => setPercent1(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">2ª variação: {percent2}%</span>
          <input
            type="range"
            min={-50}
            max={50}
            step={5}
            value={percent2}
            onChange={(e) => setPercent2(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-44 w-full"
          role="img"
          aria-label={`Gráfico de barras: valor original R$${original}, evoluindo até R$${formatCurrency(afterSecond)}`}
        >
          <line x1={0} x2={WIDTH} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          {bars.map((bar, i) => {
            const x = GAP + i * (BAR_WIDTH + GAP);
            const h = barHeight(bar.value);
            return (
              <g key={i}>
                <rect x={x} y={HEIGHT - MARGIN_BOTTOM - h} width={BAR_WIDTH} height={h} fill={bar.color} />
                <text x={x + BAR_WIDTH / 2} y={HEIGHT - MARGIN_BOTTOM + 16} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

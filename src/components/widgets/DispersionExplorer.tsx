"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 100;
const MARGIN = 24;
const MAX_VALUE = 20;

function toX(value: number): number {
  return MARGIN + (value / MAX_VALUE) * (WIDTH - 2 * MARGIN);
}

export default function DispersionExplorer() {
  const [values, setValues] = useState([2, 4, 6, 8]);

  const mean = useMemo(() => values.reduce((a, b) => a + b, 0) / values.length, [values]);
  const range = Math.max(...values) - Math.min(...values);
  const variance = useMemo(
    () => values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length,
    [values, mean]
  );
  const stdDev = Math.sqrt(variance);

  function updateValue(index: number, next: number) {
    setValues((prev) => prev.map((v, i) => (i === index ? next : v)));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Amplitude = {range} · Variância = {formatNumber(variance)} · Desvio padrão = {formatNumber(stdDev)}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {values.map((value, i) => (
          <label key={i} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-20 shrink-0 font-medium">
              Valor {i + 1}: {value}
            </span>
            <input
              type="range"
              min={0}
              max={MAX_VALUE}
              step={1}
              value={value}
              onChange={(e) => updateValue(i, Number(e.target.value))}
              className="min-w-0 flex-1 accent-[var(--color-primary)]"
              aria-label={`Valor ${i + 1}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-24 w-full"
          role="img"
          aria-label={`Reta numérica com 4 pontos de dados, amplitude ${range} e desvio padrão ${formatNumber(stdDev)}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="var(--color-muted)" strokeWidth={1.5} />
          {values.map((value, i) => (
            <circle key={i} cx={toX(value)} cy={HEIGHT / 2} r={5} fill="#2a78d6" />
          ))}
          <line x1={toX(mean)} x2={toX(mean)} y1={10} y2={HEIGHT - 10} stroke="#e34948" strokeWidth={2} strokeDasharray="4 3" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        A linha vermelha é a média ({formatNumber(mean)}). Quanto mais espalhados os pontos azuis, maior a
        variância e o desvio padrão.
      </p>
    </div>
  );
}

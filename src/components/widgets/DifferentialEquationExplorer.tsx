"use client";

import { useState } from "react";

const WIDTH = 320;
const HEIGHT = 140;
const MARGIN = 24;
const RANGE = 5;

function toX(x: number): number {
  return MARGIN + ((x + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}
function toY(y: number, k: number, y0: number): number {
  const maxY = Math.abs(k) * RANGE + Math.abs(y0) + 1;
  return HEIGHT / 2 - (y / maxY) * (HEIGHT / 2 - MARGIN);
}

export default function DifferentialEquationExplorer() {
  const [k, setK] = useState(2);
  const [y0, setY0] = useState(1);

  function y(x: number): number {
    return k * x + y0;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        dy/dx = {k} → y = {k}x {y0 >= 0 ? "+" : "−"} {Math.abs(y0)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">dy/dx = k: {k}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Taxa constante k, dy/dx"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Condição inicial y(0): {y0}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={y0}
            onChange={(e) => setY0(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Condição inicial, y(0)"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Reta solução y = ${k}x + ${y0}, passando por (0, ${y0})`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="var(--color-border)" strokeWidth={1} />
          <line
            x1={toX(-RANGE)}
            x2={toX(RANGE)}
            y1={toY(y(-RANGE), k, y0)}
            y2={toY(y(RANGE), k, y0)}
            stroke="#2a78d6"
            strokeWidth={2.5}
          />
          <circle cx={toX(0)} cy={toY(y0, k, y0)} r={5} fill="#e34948" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Integrando dy/dx = {k} em relação a x: y = {k}x + C. Como y(0) = {y0}, então C = {y0}.
      </p>
    </div>
  );
}

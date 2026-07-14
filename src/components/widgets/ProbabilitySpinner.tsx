"use client";

import { useState } from "react";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 100;

function polarToCartesian(angleDeg: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(angleRad), y: CENTER + RADIUS * Math.sin(angleRad) };
}

function describeArc(startAngle: number, endAngle: number): string {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M${CENTER},${CENTER} L${start.x},${start.y} A${RADIUS},${RADIUS} 0 ${largeArcFlag} 0 ${end.x},${end.y} Z`;
}

export default function ProbabilitySpinner() {
  const [total, setTotal] = useState(8);
  const [favorable, setFavorable] = useState(3);
  const clampedFavorable = Math.min(favorable, total);
  const percentage = Math.round((clampedFavorable / total) * 100);
  const favorableAngle = (clampedFavorable / total) * 360;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        P(A) = {clampedFavorable}/{total} = {percentage}%
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Casos possíveis: {total}</span>
          <input
            type="range"
            min={2}
            max={12}
            step={1}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Casos favoráveis: {clampedFavorable}</span>
          <input
            type="range"
            min={0}
            max={total}
            step={1}
            value={clampedFavorable}
            onChange={(e) => setFavorable(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-white"
          role="img"
          aria-label={`Roda de probabilidade com ${clampedFavorable} casos favoráveis em ${total}`}
        >
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#e4e2f1" />
          {favorableAngle >= 359.99 ? (
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#2a78d6" />
          ) : (
            favorableAngle > 0 && <path d={describeArc(0, favorableAngle)} fill="#2a78d6" />
          )}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#898781" strokeWidth={1.5} />
        </svg>
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#2a78d6]" aria-hidden /> Favorável
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#e4e2f1] ring-1 ring-border" aria-hidden /> Restante
        </span>
      </div>
    </div>
  );
}

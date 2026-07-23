"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 300;
const HEIGHT = 140;
const MARGIN_BOTTOM = 24;

export default function ConeVolumeExplorer() {
  const [r, setR] = useState(3);
  const [h, setH] = useState(4);

  const cylinderCoefficient = r * r * h;
  const coneCoefficient = cylinderCoefficient / 3;

  const bars = [
    { label: "Cilindro (πr²h)", coefficient: cylinderCoefficient, color: "var(--color-muted)" },
    { label: "Cone (÷3)", coefficient: coneCoefficient, color: "#2a78d6" },
  ];
  const maxCoefficient = Math.max(cylinderCoefficient, 1);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Volume do cone = {formatNumber(coneCoefficient)}π ≈ {formatNumber(coneCoefficient * Math.PI)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">Raio: {r}</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Raio da base"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">Altura: {h}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Altura"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Comparação de volume: cilindro ${formatNumber(cylinderCoefficient)}π vs cone ${formatNumber(coneCoefficient)}π (um terço)`}
        >
          <line x1={0} x2={WIDTH} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          {bars.map((bar, i) => {
            const barWidth = 90;
            const x = 30 + i * (barWidth + 40);
            const barHeight = (bar.coefficient / maxCoefficient) * (HEIGHT - MARGIN_BOTTOM - 10);
            return (
              <g key={i}>
                <rect x={x} y={HEIGHT - MARGIN_BOTTOM - barHeight} width={barWidth} height={barHeight} fill={bar.color} fillOpacity={0.7} />
                <text x={x + barWidth / 2} y={HEIGHT - MARGIN_BOTTOM + 16} fontSize={10} fill="var(--color-muted)" textAnchor="middle">
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Volume do cone = πr²h ÷ 3 = π×{r}²×{h} ÷ 3 = {formatNumber(coneCoefficient)}π.
      </p>
    </div>
  );
}

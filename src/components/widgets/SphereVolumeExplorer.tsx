"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const MAX_R = 6;
const SIZE = 140;

export default function SphereVolumeExplorer() {
  const [r, setR] = useState(3);

  const volumeCoefficient = (4 / 3) * r ** 3;
  const areaCoefficient = 4 * r ** 2;
  const radiusPx = (r / MAX_R) * (SIZE / 2 - 10);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Volume = {formatNumber(volumeCoefficient)}π · Área = {formatNumber(areaCoefficient)}π
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">Raio: {r}</span>
          <input
            type="range"
            min={1}
            max={MAX_R}
            step={1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Raio da esfera"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-center overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-36 w-36"
          role="img"
          aria-label={`Esfera de raio ${r}: volume ${formatNumber(volumeCoefficient)}π, área da superfície ${formatNumber(areaCoefficient)}π`}
        >
          <circle cx={SIZE / 2} cy={SIZE / 2} r={radiusPx} fill="#2a78d6" fillOpacity={0.25} stroke="#2a78d6" strokeWidth={2} />
          <line x1={SIZE / 2} x2={SIZE / 2 + radiusPx} y1={SIZE / 2} y2={SIZE / 2} stroke="#e34948" strokeWidth={2} strokeDasharray="3 2" />
          <text x={SIZE / 2 + radiusPx / 2} y={SIZE / 2 - 6} fontSize={11} fill="#e34948" textAnchor="middle">
            r={r}
          </text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Volume = (4/3)πr³ = (4/3)×π×{r}³ = {formatNumber(volumeCoefficient)}π. Área = 4πr² = 4×π×{r}² ={" "}
        {formatNumber(areaCoefficient)}π.
      </p>
    </div>
  );
}

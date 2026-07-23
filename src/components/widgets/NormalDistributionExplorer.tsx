"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 180;
const MARGIN = 20;
const STEPS = 60;

function gaussian(t: number, mean: number, sigma: number): number {
  return Math.exp(-((t - mean) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
}

export default function NormalDistributionExplorer() {
  const [mean, setMean] = useState(100);
  const [sigma, setSigma] = useState(15);
  const [x, setX] = useState(130);

  const domainMin = mean - 4 * sigma;
  const domainMax = mean + 4 * sigma;
  const clampedX = Math.min(domainMax, Math.max(domainMin, x));
  const z = (clampedX - mean) / sigma;
  const peak = gaussian(mean, mean, sigma);

  function toX(t: number): number {
    return MARGIN + ((t - domainMin) / (domainMax - domainMin)) * (WIDTH - 2 * MARGIN);
  }
  function toY(value: number): number {
    return HEIGHT - MARGIN - (value / peak) * (HEIGHT - 2 * MARGIN);
  }

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = domainMin + (i / STEPS) * (domainMax - domainMin);
      points.push(`${i === 0 ? "M" : "L"}${toX(t)},${toY(gaussian(t, mean, sigma))}`);
    }
    return points.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mean, sigma]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        x = {formatNumber(clampedX)} · z = {formatNumber(z)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Média (μ): {mean}</span>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Desvio padrão (σ): {sigma}</span>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Valor (x): {formatNumber(clampedX)}</span>
          <input
            type="range"
            min={domainMin}
            max={domainMax}
            step={1}
            value={clampedX}
            onChange={(e) => setX(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Curva normal com média ${mean} e desvio padrão ${sigma}, valor x=${formatNumber(clampedX)}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT - MARGIN} y2={HEIGHT - MARGIN} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <line x1={toX(clampedX)} x2={toX(clampedX)} y1={MARGIN} y2={HEIGHT - MARGIN} stroke="#e34948" strokeWidth={2} strokeDasharray="4 3" />
        </svg>
      </div>
    </div>
  );
}

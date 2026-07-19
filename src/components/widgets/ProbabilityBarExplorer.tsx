"use client";

import { useState } from "react";
import { clamp, formatNumber } from "./svgUtils";

const WIDTH = 300;
const HEIGHT = 60;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function ProbabilityBarExplorer() {
  const [total, setTotal] = useState(6);
  const [favorable, setFavorable] = useState(2);

  const clampedFavorable = clamp(favorable, 0, total);
  const probability = clampedFavorable / total;
  const divisor = gcd(clampedFavorable, total) || 1;
  const simplified = `${clampedFavorable / divisor}/${total / divisor}`;
  const barWidth = probability * WIDTH;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        P(A) = {clampedFavorable}/{total} = {simplified} = {formatNumber(probability)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Casos possíveis: {total}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Casos possíveis (tamanho do espaço amostral)"
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
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Casos favoráveis ao evento A"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-14 w-full"
          role="img"
          aria-label={`Barra de probabilidade: ${clampedFavorable} favoráveis em ${total} possíveis, P(A) = ${formatNumber(probability)}`}
        >
          <rect x={0} y={10} width={WIDTH} height={30} rx={6} fill="#e6e4de" />
          <rect x={0} y={10} width={barWidth} height={30} rx={6} fill="#2a78d6" />
          <text x={WIDTH / 2} y={54} fontSize={11} fill="#3d3b47" textAnchor="middle">
            P(A) preenchido em azul · P(não A) = {formatNumber(1 - probability)} em cinza
          </text>
        </svg>
      </div>
    </div>
  );
}

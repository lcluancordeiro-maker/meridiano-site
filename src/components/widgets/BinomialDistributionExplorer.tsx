"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 160;
const MARGIN_BOTTOM = 24;
const MARGIN_TOP = 10;

function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

function binomialProbability(n: number, k: number, p: number): number {
  return combination(n, k) * p ** k * (1 - p) ** (n - k);
}

export default function BinomialDistributionExplorer() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);

  const probabilities = useMemo(() => {
    const values: number[] = [];
    for (let k = 0; k <= n; k++) values.push(binomialProbability(n, k, p));
    return values;
  }, [n, p]);

  const maxProb = Math.max(...probabilities, 0.01);
  const expected = n * p;
  const barWidth = (WIDTH - 2 * 10) / (n + 1);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        n={n}, p={formatNumber(p)} · E(X) = n×p = {formatNumber(expected)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Tentativas (n): {n}</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de tentativas, n"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">P(sucesso) (p): {formatNumber(p)}</span>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Probabilidade de sucesso em cada tentativa, p"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Distribuição binomial com n=${n} e p=${formatNumber(p)}, valor esperado ${formatNumber(expected)}`}
        >
          <line
            x1={10}
            x2={WIDTH - 10}
            y1={HEIGHT - MARGIN_BOTTOM}
            y2={HEIGHT - MARGIN_BOTTOM}
            stroke="#898781"
            strokeWidth={1.5}
          />
          {probabilities.map((prob, k) => {
            const h = (prob / maxProb) * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP);
            const x = 10 + k * barWidth;
            const isNearMean = Math.abs(k - expected) < 0.5;
            return (
              <g key={k}>
                <rect
                  x={x + 1}
                  y={HEIGHT - MARGIN_BOTTOM - h}
                  width={Math.max(barWidth - 2, 1)}
                  height={h}
                  fill={isNearMean ? "#e34948" : "#2a78d6"}
                />
                {n <= 15 && (
                  <text x={x + barWidth / 2} y={HEIGHT - MARGIN_BOTTOM + 12} fontSize={8} fill="#898781" textAnchor="middle">
                    {k}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Cada barra é P(X=k) — a probabilidade de exatamente k sucessos em {n} tentativas. A barra vermelha marca o valor esperado.
      </p>
    </div>
  );
}

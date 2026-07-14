"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 300;
const HEIGHT = 220;
const MARGIN = 30;
const X_VALUES = [1, 2, 3, 4, 5];
const MAX_Y = 10;

function toX(x: number): number {
  return MARGIN + ((x - 1) / (X_VALUES.length - 1)) * (WIDTH - 2 * MARGIN);
}

function toY(y: number): number {
  return HEIGHT - MARGIN - (y / MAX_Y) * (HEIGHT - 2 * MARGIN);
}

export default function RegressionLineExplorer() {
  const [yValues, setYValues] = useState([2, 4, 5, 4, 5]);

  const { slope, intercept, r2 } = useMemo(() => {
    const n = X_VALUES.length;
    const xMean = X_VALUES.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (X_VALUES[i] - xMean) * (yValues[i] - yMean);
      den += (X_VALUES[i] - xMean) ** 2;
    }
    const b1 = num / den;
    const b0 = yMean - b1 * xMean;
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const yHat = b0 + b1 * X_VALUES[i];
      ssRes += (yValues[i] - yHat) ** 2;
      ssTot += (yValues[i] - yMean) ** 2;
    }
    const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    return { slope: b1, intercept: b0, r2: rSquared };
  }, [yValues]);

  function updateY(index: number, next: number) {
    setYValues((prev) => prev.map((v, i) => (i === index ? next : v)));
  }

  const linePath = `M${toX(1)},${toY(intercept + slope * 1)} L${toX(5)},${toY(intercept + slope * 5)}`;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        ŷ = {formatNumber(intercept)} + {formatNumber(slope)}x · R² = {formatNumber(r2)}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {yValues.map((y, i) => (
          <label key={i} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-20 shrink-0 font-medium">
              y({X_VALUES[i]}): {y}
            </span>
            <input
              type="range"
              min={0}
              max={MAX_Y}
              step={1}
              value={y}
              onChange={(e) => updateY(i, Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full"
          role="img"
          aria-label={`Gráfico de dispersão com reta de regressão, R² = ${formatNumber(r2)}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT - MARGIN} y2={HEIGHT - MARGIN} stroke="#898781" strokeWidth={1.5} />
          <line x1={MARGIN} x2={MARGIN} y1={MARGIN} y2={HEIGHT - MARGIN} stroke="#898781" strokeWidth={1.5} />
          <path d={linePath} stroke="#e34948" strokeWidth={2} fill="none" />
          {X_VALUES.map((x, i) => (
            <circle key={i} cx={toX(x)} cy={toY(yValues[i])} r={5} fill="#2a78d6" />
          ))}
        </svg>
      </div>
    </div>
  );
}

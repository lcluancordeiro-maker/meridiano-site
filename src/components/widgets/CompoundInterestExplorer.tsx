"use client";

import { useMemo, useState } from "react";

const WIDTH = 320;
const HEIGHT = 220;
const MARGIN_LEFT = 40;
const MARGIN_BOTTOM = 24;
const MARGIN_TOP = 10;
const MARGIN_RIGHT = 10;
const MAX_YEARS = 10;
const STEPS = 40;
const PLOT_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const PLOT_HEIGHT = HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

function toX(years: number): number {
  return MARGIN_LEFT + (years / MAX_YEARS) * PLOT_WIDTH;
}

function toY(value: number, maxAmount: number): number {
  return MARGIN_TOP + PLOT_HEIGHT - (value / maxAmount) * PLOT_HEIGHT;
}

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function CompoundInterestExplorer() {
  const [principal, setPrincipal] = useState(1000);
  const [ratePercent, setRatePercent] = useState(10);
  const [years, setYears] = useState(5);

  const rate = ratePercent / 100;
  const amount = principal * Math.pow(1 + rate, years);
  const maxAmount = principal * Math.pow(1 + rate, MAX_YEARS);

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * MAX_YEARS;
      const value = principal * Math.pow(1 + rate, t);
      points.push(`${i === 0 ? "M" : "L"}${toX(t)},${toY(value, maxAmount)}`);
    }
    return points.join(" ");
  }, [principal, rate, maxAmount]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        M = R$ {formatCurrency(amount)} em {years} {years === 1 ? "ano" : "anos"}
      </p>
      <p className="mt-1 text-sm text-muted">
        C = R$ {principal} · i = {ratePercent}% ao ano
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Capital (C): R$ {principal}</span>
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Taxa (i): {ratePercent}%</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={ratePercent}
            onChange={(e) => setRatePercent(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Tempo (t): {years} anos</span>
          <input
            type="range"
            min={1}
            max={MAX_YEARS}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full"
          role="img"
          aria-label={`Gráfico de crescimento exponencial do montante ao longo de ${MAX_YEARS} anos`}
        >
          <line
            x1={MARGIN_LEFT}
            x2={WIDTH - MARGIN_RIGHT}
            y1={HEIGHT - MARGIN_BOTTOM}
            y2={HEIGHT - MARGIN_BOTTOM}
            stroke="var(--color-muted)"
            strokeWidth={1.5}
          />
          <line x1={MARGIN_LEFT} x2={MARGIN_LEFT} y1={MARGIN_TOP} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toX(years)} cy={toY(amount, maxAmount)} r={5} fill="#eda100" />
        </svg>
      </div>
    </div>
  );
}

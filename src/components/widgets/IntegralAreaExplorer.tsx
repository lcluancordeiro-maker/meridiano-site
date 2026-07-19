"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 160;
const MARGIN = 24;
const DOMAIN_MAX = 6;
const STEPS = 40;

function f(x: number): number {
  return x * x;
}

function toX(x: number): number {
  return MARGIN + (x / DOMAIN_MAX) * (WIDTH - 2 * MARGIN);
}
function toY(y: number): number {
  const maxY = f(DOMAIN_MAX);
  return HEIGHT - MARGIN - (y / maxY) * (HEIGHT - 2 * MARGIN);
}

export default function IntegralAreaExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(4);

  const clampedB = Math.max(a, b);
  const integral = (clampedB ** 3 - a ** 3) / 3;

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * DOMAIN_MAX;
      points.push(`${i === 0 ? "M" : "L"}${toX(x)},${toY(f(x))}`);
    }
    return points.join(" ");
  }, []);

  const areaPath = useMemo(() => {
    const points: string[] = [`M${toX(a)},${toY(0)}`];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = a + (i / steps) * (clampedB - a);
      points.push(`L${toX(x)},${toY(f(x))}`);
    }
    points.push(`L${toX(clampedB)},${toY(0)} Z`);
    return points.join(" ");
  }, [a, clampedB]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        ∫[{a},{clampedB}] x² dx = {formatNumber(integral)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a: {a}</span>
          <input
            type="range"
            min={0}
            max={DOMAIN_MAX}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Limite inferior da integral, a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b: {clampedB}</span>
          <input
            type="range"
            min={a}
            max={DOMAIN_MAX}
            step={1}
            value={clampedB}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Limite superior da integral, b"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Área sob a curva f(x)=x² entre x=${a} e x=${clampedB}, valor da integral ${formatNumber(integral)}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT - MARGIN} y2={HEIGHT - MARGIN} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={areaPath} fill="#2a78d6" fillOpacity={0.25} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        F(x) = x³/3 → F({clampedB}) − F({a}) = {formatNumber(clampedB ** 3 / 3)} − {formatNumber(a ** 3 / 3)} ={" "}
        {formatNumber(integral)}.
      </p>
    </div>
  );
}

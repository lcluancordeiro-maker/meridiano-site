"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 160;
const MARGIN = 24;
const RANGE = 8;
const STEPS = 40;

export default function CriticalPointExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-6);
  const [c, setC] = useState(5);

  const criticalX = -b / (2 * a);
  const kind = a > 0 ? "mínimo local" : "máximo local";

  function f(x: number): number {
    return a * x * x + b * x + c;
  }

  const domainMin = criticalX - RANGE;
  const domainMax = criticalX + RANGE;
  function toXDomain(x: number): number {
    return MARGIN + ((x - domainMin) / (domainMax - domainMin)) * (WIDTH - 2 * MARGIN);
  }

  const values = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i <= STEPS; i++) list.push(f(domainMin + (i / STEPS) * (domainMax - domainMin)));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, criticalX]);

  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  function toYDomain(y: number): number {
    if (maxY === minY) return HEIGHT / 2;
    return HEIGHT - MARGIN - ((y - minY) / (maxY - minY)) * (HEIGHT - 2 * MARGIN);
  }

  const curvePath = values.map((y, i) => `${i === 0 ? "M" : "L"}${toXDomain(domainMin + (i / STEPS) * (domainMax - domainMin))},${toYDomain(y)}`).join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f&apos;(x) = 0 em x = {formatNumber(criticalX)} → {kind}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a: {a}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 1)}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b: {b}</span>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente b"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">c: {c}</span>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente c"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Gráfico de f(x) = ${a}x² + ${b}x + ${c}, com ponto crítico em x=${formatNumber(criticalX)} (${kind})`}
        >
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <line
            x1={toXDomain(criticalX)}
            x2={toXDomain(criticalX)}
            y1={MARGIN}
            y2={HEIGHT - MARGIN}
            stroke="#e34948"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <circle cx={toXDomain(criticalX)} cy={toYDomain(f(criticalX))} r={5} fill="#e34948" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        f&apos;(x) = {2 * a}x {b >= 0 ? "+" : "−"} {Math.abs(b)}. f&apos;&apos;(x) = {2 * a}
        {2 * a > 0 ? " > 0 → concavidade para cima → mínimo." : " < 0 → concavidade para baixo → máximo."}
      </p>
    </div>
  );
}

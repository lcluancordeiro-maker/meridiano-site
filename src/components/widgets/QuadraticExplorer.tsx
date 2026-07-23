"use client";

import { useMemo, useState } from "react";
import { RANGE, SIZE, TICKS, formatNumber, toPx, toPy } from "./svgUtils";

const STEPS = 60;

export default function QuadraticExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const x = -RANGE + (i / STEPS) * (2 * RANGE);
      const y = a * x * x + b * x + c;
      points.push(`${i === 0 ? "M" : "L"}${toPx(x)},${toPy(y)}`);
    }
    return points.join(" ");
  }, [a, b, c]);

  const xv = -b / (2 * a);
  const yv = a * xv * xv + b * xv + c;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f(x) = {formatNumber(a)}x² {b >= 0 ? "+" : "−"} {formatNumber(Math.abs(b))}x {c >= 0 ? "+" : "−"}{" "}
        {formatNumber(Math.abs(c))}
      </p>
      <p className="mt-1 text-sm text-muted">
        Concavidade para {a > 0 ? "cima (mínimo)" : "baixo (máximo)"} — vértice em ({formatNumber(xv)},{" "}
        {formatNumber(yv)}).
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Coeficiente a: {formatNumber(a)}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.5}
            value={a}
            onChange={(e) => {
              const next = Number(e.target.value);
              setA(next === 0 ? 0.5 : next);
            }}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Coeficiente b: {formatNumber(b)}</span>
          <input
            type="range"
            min={-6}
            max={6}
            step={0.5}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Coeficiente c: {formatNumber(c)}</span>
          <input
            type="range"
            min={-6}
            max={6}
            step={0.5}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-surface"
          role="img"
          aria-label={`Gráfico da parábola f(x) = ${formatNumber(a)}x² ${b >= 0 ? "+" : "−"} ${formatNumber(
            Math.abs(b)
          )}x ${c >= 0 ? "+" : "−"} ${formatNumber(Math.abs(c))}`}
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          {Math.abs(xv) <= RANGE && Math.abs(yv) <= RANGE && (
            <circle cx={toPx(xv)} cy={toPy(yv)} r={4} fill="#eda100" />
          )}
        </svg>
      </div>
    </div>
  );
}

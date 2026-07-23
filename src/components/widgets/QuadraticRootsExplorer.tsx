"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 100;
const MARGIN = 24;
const RANGE = 10;

function toX(value: number): number {
  return MARGIN + ((value + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}

export default function QuadraticRootsExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const delta = b * b - 4 * a * c;

  const roots = useMemo(() => {
    if (delta < 0) return [];
    if (delta === 0) return [-b / (2 * a)];
    const sqrtDelta = Math.sqrt(delta);
    return [(-b - sqrtDelta) / (2 * a), (-b + sqrtDelta) / (2 * a)];
  }, [a, b, delta]);

  const status =
    delta > 0 ? "duas raízes reais diferentes" : delta === 0 ? "uma raiz real (dupla)" : "nenhuma raiz real";

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Δ = {delta} → {status}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">a: {a}</span>
          <input
            type="range"
            min={-4}
            max={4}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 1)}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">b: {b}</span>
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
          <span className="w-20 shrink-0 font-medium">c: {c}</span>
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

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-24 w-full"
          role="img"
          aria-label={
            roots.length > 0
              ? `Reta numérica com as raízes ${roots.map((r) => formatNumber(r)).join(" e ")}`
              : "Reta numérica sem raízes reais para exibir"
          }
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="var(--color-muted)" strokeWidth={1.5} />
          {roots.map((r, i) => {
            const x = toX(Math.max(-RANGE, Math.min(RANGE, r)));
            return (
              <g key={i}>
                <circle cx={x} cy={HEIGHT / 2} r={6} fill="#e34948" />
                <text x={x} y={HEIGHT / 2 - 14} fontSize={12} fontWeight={700} fill="#e34948" textAnchor="middle">
                  {formatNumber(r)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-sm text-foreground">
        Δ = b² − 4ac = {b}² − 4×{a}×{c} = {delta}.{" "}
        {roots.length > 0
          ? `x = (${-b} ± √${delta}) / ${2 * a} → x = ${roots.map((r) => formatNumber(r)).join(" ou x = ")}`
          : "Como Δ < 0, a fórmula de Bhaskara pede a raiz de um número negativo — não há solução real."}
      </p>
    </div>
  );
}

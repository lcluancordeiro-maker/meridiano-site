"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 220;
const MARGIN = 24;
const DOMAIN_RANGE = 4;
const STEPS = 40;

export default function EpsilonDeltaExplorer() {
  const [m, setM] = useState(2);
  const [a, setA] = useState(3);
  const [epsilon, setEpsilon] = useState(1);

  const L = m * a;
  const delta = m !== 0 ? epsilon / Math.abs(m) : 0;

  function f(x: number): number {
    return m * x;
  }

  const domainMin = a - DOMAIN_RANGE;
  const domainMax = a + DOMAIN_RANGE;
  function toXDomain(x: number): number {
    return MARGIN + ((x - domainMin) / (domainMax - domainMin)) * (WIDTH - 2 * MARGIN);
  }

  const values = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i <= STEPS; i++) list.push(f(domainMin + (i / STEPS) * (domainMax - domainMin)));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m, a]);

  const minY = Math.min(...values, L - epsilon);
  const maxY = Math.max(...values, L + epsilon);
  function toYDomain(y: number): number {
    if (maxY === minY) return HEIGHT / 2;
    return HEIGHT - MARGIN - ((y - minY) / (maxY - minY)) * (HEIGHT - 2 * MARGIN);
  }

  const curvePath = values
    .map((y, i) => `${i === 0 ? "M" : "L"}${toXDomain(domainMin + (i / STEPS) * (domainMax - domainMin))},${toYDomain(y)}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f(x)={m}x · a={a} · L={L} · ε={epsilon} → δ={formatNumber(delta)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">m: {m}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={m}
            onChange={(e) => setM(Number(e.target.value) || 1)}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente angular m"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">a: {a}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Ponto a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-20 shrink-0 font-medium">ε: {epsilon}</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={epsilon}
            onChange={(e) => setEpsilon(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor de épsilon"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full"
          role="img"
          aria-label={`Gráfico de f(x)=${m}x perto de x=${a}, com faixa ε=${epsilon} ao redor de L=${L} e faixa δ=${formatNumber(delta)} ao redor de a`}
        >
          <rect
            x={MARGIN}
            y={toYDomain(L + epsilon)}
            width={WIDTH - 2 * MARGIN}
            height={toYDomain(L - epsilon) - toYDomain(L + epsilon)}
            fill="#1baf7a"
            fillOpacity={0.12}
          />
          <rect
            x={toXDomain(a - delta)}
            y={MARGIN}
            width={toXDomain(a + delta) - toXDomain(a - delta)}
            height={HEIGHT - 2 * MARGIN}
            fill="#2a78d6"
            fillOpacity={0.12}
          />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toXDomain(a)} cy={toYDomain(L)} r={5} fill="#e34948" />
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste m, a e ε e observe como δ=ε/|m| se recalcula — encontre valores em que δ seja exatamente 0,5 (dica: m=2, ε=1)."
        isMet={delta === 0.5}
      />
    </div>
  );
}

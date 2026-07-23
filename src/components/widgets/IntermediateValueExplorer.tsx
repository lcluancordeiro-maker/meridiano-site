"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 200;
const MARGIN = 24;
const DOMAIN_MIN = -3;
const DOMAIN_MAX = 3;
const STEPS = 60;

function f(x: number): number {
  return x * x * x - 3 * x + 1;
}

export default function IntermediateValueExplorer() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);

  function updateA(next: number) {
    setA(Math.min(next, b - 0.5));
  }
  function updateB(next: number) {
    setB(Math.max(next, a + 0.5));
  }

  const fa = f(a);
  const fb = f(b);
  const oppositeSigns = (fa < 0 && fb > 0) || (fa > 0 && fb < 0);

  function toXDomain(x: number): number {
    return MARGIN + ((x - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * (WIDTH - 2 * MARGIN);
  }

  const values = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i <= STEPS; i++) list.push(f(DOMAIN_MIN + (i / STEPS) * (DOMAIN_MAX - DOMAIN_MIN)));
    return list;
  }, []);

  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  function toYDomain(y: number): number {
    return HEIGHT - MARGIN - ((y - minY) / (maxY - minY)) * (HEIGHT - 2 * MARGIN);
  }

  const curvePath = values
    .map((y, i) => `${i === 0 ? "M" : "L"}${toXDomain(DOMAIN_MIN + (i / STEPS) * (DOMAIN_MAX - DOMAIN_MIN))},${toYDomain(y)}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f(x)=x³−3x+1 · f({formatNumber(a)})={formatNumber(fa)} · f({formatNumber(b)})={formatNumber(fb)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {oppositeSigns
          ? "Sinais opostos — o TVI garante uma raiz de f em (a,b)."
          : "Mesmo sinal — o TVI não garante nada sobre raízes neste intervalo."}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a: {formatNumber(a)}</span>
          <input
            type="range"
            min={DOMAIN_MIN}
            max={DOMAIN_MAX}
            step={0.5}
            value={a}
            onChange={(e) => updateA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Extremidade a do intervalo"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b: {formatNumber(b)}</span>
          <input
            type="range"
            min={DOMAIN_MIN}
            max={DOMAIN_MAX}
            step={0.5}
            value={b}
            onChange={(e) => updateB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Extremidade b do intervalo"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-48 w-full"
          role="img"
          aria-label={`Gráfico de f(x)=x³−3x+1 com f(${formatNumber(a)})=${formatNumber(fa)} e f(${formatNumber(b)})=${formatNumber(fb)}. ${
            oppositeSigns ? "Sinais opostos, raiz garantida no intervalo." : "Mesmo sinal, nada garantido."
          }`}
        >
          <line
            x1={MARGIN}
            x2={WIDTH - MARGIN}
            y1={toYDomain(0)}
            y2={toYDomain(0)}
            stroke="var(--color-muted)"
            strokeWidth={1.5}
          />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toXDomain(a)} cy={toYDomain(fa)} r={5} fill={oppositeSigns ? "#1baf7a" : "#e34948"} />
          <circle cx={toXDomain(b)} cy={toYDomain(fb)} r={5} fill={oppositeSigns ? "#1baf7a" : "#e34948"} />
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste a e b até que f(a) e f(b) tenham sinais opostos, garantindo pelo TVI uma raiz em (a,b) (dica: a=-2, b=0)."
        isMet={oppositeSigns}
      />
    </div>
  );
}

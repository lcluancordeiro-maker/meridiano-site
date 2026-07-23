"use client";

import { useMemo, useState } from "react";
import { RANGE, SIZE, TICKS, toPx, toPy, formatNumber as formatCoefficient } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

export default function SlopeExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);

  const linePath = useMemo(() => {
    const y1 = a * -RANGE + b;
    const y2 = a * RANGE + b;
    return `M${toPx(-RANGE)},${toPy(y1)} L${toPx(RANGE)},${toPy(y2)}`;
  }, [a, b]);

  const aLabel = formatCoefficient(a);
  const bLabel = formatCoefficient(Math.abs(b));

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f(x) = {aLabel}x {b >= 0 ? "+" : "−"} {bLabel}
      </p>
      <p className="mt-1 text-sm text-muted">
        {a > 0 ? "Crescente" : a < 0 ? "Decrescente" : "Constante"} — corta o eixo y em (0, {formatCoefficient(b)}).
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Coeficiente angular (a): {aLabel}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Coeficiente linear (b): {formatCoefficient(b)}</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-surface"
          role="img"
          aria-label={`Gráfico da reta f(x) = ${aLabel}x ${b >= 0 ? "+" : "−"} ${bLabel}`}
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={linePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toPx(0)} cy={toPy(b)} r={4} fill="#2a78d6" />
        </svg>
      </div>

      <WidgetChallenge
        goal="Monte a reta f(x) = -2x + 3 usando os sliders."
        isMet={a === -2 && b === 3}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { RANGE, SIZE, TICKS, formatNumber, toPx, toPy } from "./svgUtils";

const STEPS = 60;

export default function TangentLineExplorer() {
  const [x, setX] = useState(1);
  const y = x * x;
  const slope = 2 * x;

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const px = -RANGE + (i / STEPS) * (2 * RANGE);
      points.push(`${i === 0 ? "M" : "L"}${toPx(px)},${toPy(px * px)}`);
    }
    return points.join(" ");
  }, []);

  const tangentPath = useMemo(() => {
    const y1 = slope * (-RANGE - x) + y;
    const y2 = slope * (RANGE - x) + y;
    return `M${toPx(-RANGE)},${toPy(y1)} L${toPx(RANGE)},${toPy(y2)}`;
  }, [x, y, slope]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        f({formatNumber(x)}) = {formatNumber(y)} · f&apos;({formatNumber(x)}) = {formatNumber(slope)}
      </p>
      <p className="mt-1 text-sm text-muted">
        A reta tangente ao gráfico de f(x) = x² no ponto x = {formatNumber(x)} tem coeficiente
        angular {formatNumber(slope)}.
      </p>

      <label className="mt-4 flex items-center gap-3 text-sm text-foreground">
        <span className="w-24 shrink-0 font-medium">Ponto x: {formatNumber(x)}</span>
        <input
          type="range"
          min={-2.5}
          max={2.5}
          step={0.25}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="flex-1 accent-[var(--color-primary)]"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-white"
          role="img"
          aria-label={`Gráfico de f(x) = x² com reta tangente no ponto x = ${formatNumber(x)}`}
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="#898781" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="#898781" strokeWidth={1.5} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <path d={tangentPath} fill="none" stroke="#e34948" strokeWidth={2} strokeDasharray="5 4" />
          <circle cx={toPx(x)} cy={toPy(y)} r={5} fill="#eda100" />
        </svg>
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#2a78d6]" aria-hidden /> f(x) = x²
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#e34948]" aria-hidden /> Tangente
        </span>
      </div>
    </div>
  );
}

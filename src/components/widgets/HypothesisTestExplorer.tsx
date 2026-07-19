"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 140;
const MARGIN = 20;
const RANGE = 3.5;
const STEPS = 60;

function standardNormal(t: number): number {
  return Math.exp(-(t * t) / 2) / Math.sqrt(2 * Math.PI);
}

const Z_CRITICAL: Record<string, number> = { "5": 1.96, "1": 2.576 };

function toX(t: number): number {
  return MARGIN + ((t + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}
function toY(value: number): number {
  const peak = standardNormal(0);
  return HEIGHT - MARGIN - (value / peak) * (HEIGHT - 2 * MARGIN);
}

export default function HypothesisTestExplorer() {
  const [z, setZ] = useState(1);
  const [alpha, setAlpha] = useState<"5" | "1">("5");

  const zCritical = Z_CRITICAL[alpha];
  const rejects = Math.abs(z) > zCritical;

  function curveSegment(from: number, to: number, steps: number): string {
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = from + (i / steps) * (to - from);
      points.push(`${i === 0 ? "M" : "L"}${toX(t)},${toY(standardNormal(t))}`);
    }
    return points.join(" ");
  }

  const curvePath = useMemo(() => curveSegment(-RANGE, RANGE, STEPS), []);

  function tailPath(from: number, to: number): string {
    const baseline = HEIGHT - MARGIN;
    return `M${toX(from)},${baseline} ${curveSegment(from, to, 20)} L${toX(to)},${baseline} Z`;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        z = {formatNumber(z)} · {rejects ? "rejeita H0" : "não rejeita H0"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Estatística z: {formatNumber(z)}</span>
          <input
            type="range"
            min={-RANGE}
            max={RANGE}
            step={0.1}
            value={z}
            onChange={(e) => setZ(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Estatística de teste z calculada"
          />
        </label>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Significância (α):</span>
          <div className="flex gap-2">
            {(["5", "1"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setAlpha(level)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  alpha === level
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-foreground hover:bg-background"
                }`}
                aria-pressed={alpha === level}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Curva normal padrão com z=${formatNumber(z)} e valor crítico ±${zCritical} para α=${alpha}%; ${rejects ? "rejeita" : "não rejeita"} H0`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT - MARGIN} y2={HEIGHT - MARGIN} stroke="#898781" strokeWidth={1.5} />
          <path d={tailPath(-RANGE, -zCritical)} fill="#e34948" fillOpacity={0.25} />
          <path d={tailPath(zCritical, RANGE)} fill="#e34948" fillOpacity={0.25} />
          <path d={curvePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <line x1={toX(-zCritical)} x2={toX(-zCritical)} y1={MARGIN} y2={HEIGHT - MARGIN} stroke="#e34948" strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={toX(zCritical)} x2={toX(zCritical)} y1={MARGIN} y2={HEIGHT - MARGIN} stroke="#e34948" strokeWidth={1.5} strokeDasharray="3 3" />
          <line
            x1={toX(z)}
            x2={toX(z)}
            y1={MARGIN}
            y2={HEIGHT - MARGIN}
            stroke={rejects ? "#e34948" : "#1baf7a"}
            strokeWidth={2.5}
          />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Zonas vermelhas: região de rejeição além de ±{zCritical}. A linha {rejects ? "vermelha" : "verde"} é o z
        calculado — {rejects ? "cai na região crítica" : "fica dentro da faixa esperada"}.
      </p>
    </div>
  );
}

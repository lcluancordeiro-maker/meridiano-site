"use client";

import { useState } from "react";
import { clamp, formatNumber } from "./svgUtils";

export default function ProbabilityRulesExplorer() {
  const [pA, setPA] = useState(0.5);
  const [pB, setPB] = useState(0.4);
  const [pIntersection, setPIntersection] = useState(0.2);

  const maxIntersection = Math.min(pA, pB);
  const clampedIntersection = clamp(pIntersection, 0, maxIntersection);
  const union = pA + pB - clampedIntersection;
  const conditional = pB > 0 ? clampedIntersection / pB : 0;
  const independent = Math.abs(pA * pB - clampedIntersection) < 0.01;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        P(A∪B) = {formatNumber(union)} · P(A|B) = {formatNumber(conditional)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">P(A): {formatNumber(pA)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={pA}
            onChange={(e) => setPA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Probabilidade de A"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">P(B): {formatNumber(pB)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={pB}
            onChange={(e) => setPB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Probabilidade de B"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">P(A∩B): {formatNumber(clampedIntersection)}</span>
          <input
            type="range"
            min={0}
            max={maxIntersection}
            step={0.05}
            value={clampedIntersection}
            onChange={(e) => setPIntersection(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Probabilidade da interseção A e B"
          />
        </label>
      </div>

      <div
        className="relative mt-4 h-40 overflow-hidden rounded-xl border border-border"
        role="img"
        aria-label={`Diagrama de probabilidades: P(A)=${formatNumber(pA)}, P(B)=${formatNumber(pB)}, P(A∩B)=${formatNumber(clampedIntersection)}`}
      >
        <svg viewBox="0 0 300 160" className="h-full w-full bg-surface">
          <circle cx={120} cy={80} r={65} fill="#2a78d6" fillOpacity={0.25} stroke="#2a78d6" strokeWidth={2} />
          <circle cx={180} cy={80} r={65} fill="#1baf7a" fillOpacity={0.25} stroke="#1baf7a" strokeWidth={2} />
          <text x={85} y={45} fontSize={13} fontWeight={600} fill="#2a78d6">
            A
          </text>
          <text x={210} y={45} fontSize={13} fontWeight={600} fill="#1baf7a">
            B
          </text>
          <text x={95} y={84} fontSize={14} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {formatNumber(pA - clampedIntersection)}
          </text>
          <text x={150} y={84} fontSize={14} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {formatNumber(clampedIntersection)}
          </text>
          <text x={205} y={84} fontSize={14} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {formatNumber(pB - clampedIntersection)}
          </text>
        </svg>
      </div>
      <p className="mt-3 text-sm text-foreground">
        P(A∩B) = {formatNumber(clampedIntersection)} {independent ? "≈ P(A)×P(B) — A e B são independentes" : "≠ P(A)×P(B) — A e B não são independentes"}.
      </p>
    </div>
  );
}

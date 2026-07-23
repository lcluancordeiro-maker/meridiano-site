"use client";

import { useState } from "react";
import { clamp } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

export default function VennDiagramExplorer() {
  const [totalA, setTotalA] = useState(12);
  const [totalB, setTotalB] = useState(9);
  const [intersection, setIntersection] = useState(4);

  const maxIntersection = Math.min(totalA, totalB);
  const clampedIntersection = clamp(intersection, 0, maxIntersection);
  const onlyA = totalA - clampedIntersection;
  const onlyB = totalB - clampedIntersection;
  const union = totalA + totalB - clampedIntersection;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        |A∪B| = |A|+|B|-|A∩B| = {totalA}+{totalB}-{clampedIntersection} = {union}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">|A|: {totalA}</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={totalA}
            onChange={(e) => setTotalA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tamanho do conjunto A"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">|B|: {totalB}</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={totalB}
            onChange={(e) => setTotalB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tamanho do conjunto B"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">|A∩B|: {clampedIntersection}</span>
          <input
            type="range"
            min={0}
            max={maxIntersection}
            step={1}
            value={clampedIntersection}
            onChange={(e) => setIntersection(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tamanho da interseção A∩B"
          />
        </label>
      </div>

      <div
        className="relative mt-4 h-48 overflow-hidden rounded-xl border border-border"
        role="img"
        aria-label={`Diagrama de Venn: apenas A tem ${onlyA}, apenas B tem ${onlyB}, ambos têm ${clampedIntersection}`}
      >
        <svg viewBox="0 0 300 200" className="h-full w-full bg-surface">
          <circle cx={120} cy={100} r={80} fill="#2a78d6" fillOpacity={0.25} stroke="#2a78d6" strokeWidth={2} />
          <circle cx={180} cy={100} r={80} fill="#1baf7a" fillOpacity={0.25} stroke="#1baf7a" strokeWidth={2} />
          <text x={80} y={60} fontSize={13} fontWeight={600} fill="#2a78d6">
            A
          </text>
          <text x={210} y={60} fontSize={13} fontWeight={600} fill="#1baf7a">
            B
          </text>
          <text x={85} y={105} fontSize={18} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {onlyA}
          </text>
          <text x={150} y={105} fontSize={18} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {clampedIntersection}
          </text>
          <text x={215} y={105} fontSize={18} fontWeight={700} fill="var(--color-foreground)" textAnchor="middle">
            {onlyB}
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste |A|, |B| e |A∩B| até que |A∪B| seja igual a 30."
        isMet={union === 30}
      />
    </div>
  );
}

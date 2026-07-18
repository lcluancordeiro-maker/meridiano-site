"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

const SIZE = 280;
const MARGIN = 30;
const SCALE = 15;

export default function PythagoreanExplorer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const hypotenuse = Math.sqrt(a * a + b * b);

  const originX = MARGIN;
  const originY = SIZE - MARGIN;
  const rightX = originX + a * SCALE;
  const topY = originY - b * SCALE;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        a² = {a}² + {b}² = {a * a + b * b} → a = {formatNumber(hypotenuse)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Cateto 1: {a}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Cateto 2: {b}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          role="img"
          aria-label={`Triângulo retângulo com catetos ${a} e ${b}, hipotenusa ${formatNumber(hypotenuse)}`}
        >
          <polygon
            points={`${originX},${originY} ${rightX},${originY} ${originX},${topY}`}
            fill="#2a78d61a"
            stroke="#2a78d6"
            strokeWidth={2}
          />
          <rect x={originX} y={originY - 12} width={12} height={12} fill="none" stroke="#898781" strokeWidth={1} />
          <text x={(originX + rightX) / 2} y={originY + 18} textAnchor="middle" fontSize="14" fill="#3d3b47">
            {a}
          </text>
          <text x={originX - 16} y={(originY + topY) / 2} textAnchor="middle" fontSize="14" fill="#3d3b47">
            {b}
          </text>
          <text
            x={(rightX + originX) / 2 + 20}
            y={(originY + topY) / 2 - 10}
            textAnchor="middle"
            fontSize="14"
            fill="#e34948"
          >
            {formatNumber(hypotenuse)}
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Monte um triângulo cuja hipotenusa seja exatamente 10."
        isMet={a * a + b * b === 100}
      />
    </div>
  );
}

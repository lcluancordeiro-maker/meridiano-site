"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 240;
const MARGIN = 20;
const MAX_SIDE = 12;
const AVAIL_W = WIDTH - 2 * MARGIN;
const AVAIL_H = HEIGHT - 2 * MARGIN;
const SCALE = Math.min(AVAIL_W / (2 * MAX_SIDE), AVAIL_H / MAX_SIDE);
const VERTEX_X = MARGIN + MAX_SIDE * SCALE;
const VERTEX_Y = HEIGHT - MARGIN;

export default function TriangleAreaExplorer() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const [angleC, setAngleC] = useState(45);

  const angleRad = (angleC * Math.PI) / 180;
  const area = Math.round(0.5 * a * b * Math.sin(angleRad) * 100) / 100;

  const pointA = { x: VERTEX_X + a * SCALE, y: VERTEX_Y };
  const pointB = {
    x: VERTEX_X + b * SCALE * Math.cos(angleRad),
    y: VERTEX_Y - b * SCALE * Math.sin(angleRad),
  };
  const midA = { x: (VERTEX_X + pointA.x) / 2, y: (VERTEX_Y + pointA.y) / 2 + 14 };
  const midB = { x: (VERTEX_X + pointB.x) / 2 - 14, y: (VERTEX_Y + pointB.y) / 2 };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Área = ½ × {a} × {b} × sen({angleC}°) ≈ {area}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Lado a: {a}</span>
          <input
            type="range"
            min={2}
            max={MAX_SIDE}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Comprimento do lado a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Lado b: {b}</span>
          <input
            type="range"
            min={2}
            max={MAX_SIDE}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Comprimento do lado b"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Ângulo C: {angleC}°</span>
          <input
            type="range"
            min={10}
            max={170}
            step={1}
            value={angleC}
            onChange={(e) => setAngleC(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Ângulo C entre os lados a e b"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-52 w-full"
          role="img"
          aria-label={`Triângulo com lados a=${a}, b=${b} e ângulo C=${angleC}° entre eles, área aproximada ${area}`}
        >
          <polygon
            points={`${VERTEX_X},${VERTEX_Y} ${pointA.x},${pointA.y} ${pointB.x},${pointB.y}`}
            fill="var(--color-primary)"
            fillOpacity={0.15}
            stroke="var(--color-primary)"
            strokeWidth={2}
          />
          <text x={midA.x} y={midA.y} fontSize={12} fill="var(--color-muted)" textAnchor="middle">
            a = {a}
          </text>
          <text x={midB.x} y={midB.y} fontSize={12} fill="var(--color-muted)" textAnchor="middle">
            b = {b}
          </text>
          <text x={VERTEX_X + 14} y={VERTEX_Y - 8} fontSize={12} fill="#e34948" textAnchor="start">
            C = {angleC}°
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste para uma área de aproximadamente 12 (dica: a=6, b=8, C=30°)."
        isMet={a === 6 && b === 8 && angleC === 30}
      />
    </div>
  );
}

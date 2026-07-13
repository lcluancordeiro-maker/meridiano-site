"use client";

import { useRef, useState } from "react";

const SIZE = 320;
const RANGE = 8;
const TICKS = [-8, -6, -4, -2, 2, 4, 6, 8];

type Point = { x: number; y: number };
type DragTarget = "a" | "b" | null;

function toPx(x: number): number {
  return ((x + RANGE) / (2 * RANGE)) * SIZE;
}

function toPy(y: number): number {
  return SIZE - ((y + RANGE) / (2 * RANGE)) * SIZE;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export default function TwoPointExplorer() {
  const [pointA, setPointA] = useState<Point>({ x: -3, y: -2 });
  const [pointB, setPointB] = useState<Point>({ x: 4, y: 3 });
  const dragging = useRef<DragTarget>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function handlePointerDownA(event: React.PointerEvent<SVGCircleElement>) {
    (event.target as Element).setPointerCapture(event.pointerId);
    dragging.current = "a";
  }

  function handlePointerDownB(event: React.PointerEvent<SVGCircleElement>) {
    (event.target as Element).setPointerCapture(event.pointerId);
    dragging.current = "b";
  }

  function endDrag() {
    dragging.current = null;
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * SIZE;
    const py = ((event.clientY - rect.top) / rect.height) * SIZE;
    const mx = clamp(Math.round((px / SIZE) * (2 * RANGE) - RANGE), -RANGE, RANGE);
    const my = clamp(Math.round(RANGE - (py / SIZE) * (2 * RANGE)), -RANGE, RANGE);
    if (dragging.current === "a") setPointA({ x: mx, y: my });
    else setPointB({ x: mx, y: my });
  }

  const distance = Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2);
  const midpoint = { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
  const slope = pointA.x === pointB.x ? null : (pointB.y - pointA.y) / (pointB.x - pointA.x);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="text-sm text-muted">Arraste os pontos A e B pelo gráfico.</p>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Distância AB</p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">{distance.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ponto médio</p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            ({formatNumber(midpoint.x)}, {formatNumber(midpoint.y)})
          </p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Coeficiente angular</p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            {slope === null ? "reta vertical" : formatNumber(slope)}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full touch-none select-none bg-white"
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          role="img"
          aria-label="Gráfico com dois pontos arrastáveis, A e B"
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="#898781" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="#898781" strokeWidth={1.5} />

          <line
            x1={toPx(pointA.x)}
            y1={toPy(pointA.y)}
            x2={toPx(pointB.x)}
            y2={toPy(pointB.y)}
            stroke="#2a78d6"
            strokeWidth={2.5}
          />
          <circle cx={toPx(midpoint.x)} cy={toPy(midpoint.y)} r={4} fill="#eda100" />

          <circle
            cx={toPx(pointA.x)}
            cy={toPy(pointA.y)}
            r={9}
            fill="#1baf7a"
            stroke="white"
            strokeWidth={2}
            className="cursor-grab"
            onPointerDown={handlePointerDownA}
          />
          <text x={toPx(pointA.x) + 12} y={toPy(pointA.y) - 8} fontSize={13} fontWeight={600} fill="#1baf7a">
            A
          </text>

          <circle
            cx={toPx(pointB.x)}
            cy={toPy(pointB.y)}
            r={9}
            fill="#d63b3b"
            stroke="white"
            strokeWidth={2}
            className="cursor-grab"
            onPointerDown={handlePointerDownB}
          />
          <text x={toPx(pointB.x) + 12} y={toPy(pointB.y) - 8} fontSize={13} fontWeight={600} fill="#d63b3b">
            B
          </text>
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { RANGE, SIZE, TICKS, clamp, formatNumber, toPx, toPy } from "./svgUtils";

type Point = { x: number; y: number };
type DragTarget = "a" | "b" | null;

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

  const ARROW_DELTA: Record<string, [number, number]> = {
    ArrowUp: [0, 1],
    ArrowDown: [0, -1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };

  function handleKeyDown(target: "a" | "b", event: React.KeyboardEvent<SVGCircleElement>) {
    const delta = ARROW_DELTA[event.key];
    if (!delta) return;
    event.preventDefault();
    const [dx, dy] = delta;
    const move = (p: Point) => ({ x: clamp(p.x + dx, -RANGE, RANGE), y: clamp(p.y + dy, -RANGE, RANGE) });
    if (target === "a") setPointA(move);
    else setPointB(move);
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
      <p className="text-sm text-muted">
        Arraste os pontos A e B pelo gráfico (ou selecione um ponto e use as setas do teclado).
      </p>

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
            className="cursor-grab focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1baf7a]"
            onPointerDown={handlePointerDownA}
            tabIndex={0}
            role="button"
            aria-label={`Ponto A em (${pointA.x}, ${pointA.y}). Use as setas do teclado para mover.`}
            onKeyDown={(e) => handleKeyDown("a", e)}
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
            className="cursor-grab focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#d63b3b]"
            onPointerDown={handlePointerDownB}
            tabIndex={0}
            role="button"
            aria-label={`Ponto B em (${pointB.x}, ${pointB.y}). Use as setas do teclado para mover.`}
            onKeyDown={(e) => handleKeyDown("b", e)}
          />
          <text x={toPx(pointB.x) + 12} y={toPy(pointB.y) - 8} fontSize={13} fontWeight={600} fill="#d63b3b">
            B
          </text>
        </svg>
      </div>
    </div>
  );
}

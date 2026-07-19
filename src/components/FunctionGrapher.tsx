"use client";

import { useMemo, useRef, useState } from "react";
import { compileExpression, MathExprError } from "@/lib/mathExpr";

const CURVE_COLORS = ["#2a78d6", "#1baf7a", "#eda100", "#4a3aa7"];

type FnEntry = {
  id: number;
  expr: string;
  color: string;
};

type Viewport = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const SIZE = 480;
const DEFAULT_VIEWPORT: Viewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

function niceStep(range: number): number {
  const roughStep = range / 8;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / magnitude;
  let step;
  if (residual > 5) step = 10 * magnitude;
  else if (residual > 2) step = 5 * magnitude;
  else if (residual > 1) step = 2 * magnitude;
  else step = magnitude;
  return step;
}

function formatTick(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded === 0 ? "0" : rounded.toString();
}

let nextId = 1;

export default function FunctionGrapher({
  initialExpressions = ["x^2"],
}: {
  initialExpressions?: string[];
}) {
  const [fns, setFns] = useState<FnEntry[]>(() =>
    initialExpressions.map((expr, i) => ({
      id: nextId++,
      expr,
      color: CURVE_COLORS[i % CURVE_COLORS.length],
    }))
  );
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
  const dragState = useRef<{ x: number; y: number; viewport: Viewport } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function updateExpr(id: number, expr: string) {
    setFns((prev) => prev.map((f) => (f.id === id ? { ...f, expr } : f)));
  }

  function removeFn(id: number) {
    setFns((prev) => prev.filter((f) => f.id !== id));
  }

  function addFn() {
    setFns((prev) => {
      if (prev.length >= CURVE_COLORS.length) return prev;
      return [
        ...prev,
        { id: nextId++, expr: "", color: CURVE_COLORS[prev.length % CURVE_COLORS.length] },
      ];
    });
  }

  function zoom(factor: number) {
    setViewport((v) => {
      const cx = (v.xMin + v.xMax) / 2;
      const cy = (v.yMin + v.yMax) / 2;
      const halfW = ((v.xMax - v.xMin) / 2) * factor;
      const halfH = ((v.yMax - v.yMin) / 2) * factor;
      return { xMin: cx - halfW, xMax: cx + halfW, yMin: cy - halfH, yMax: cy + halfH };
    });
  }

  function resetView() {
    setViewport(DEFAULT_VIEWPORT);
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { x: e.clientX, y: e.clientY, viewport };
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragState.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = (dragState.current.viewport.xMax - dragState.current.viewport.xMin) / rect.width;
    const scaleY = (dragState.current.viewport.yMax - dragState.current.viewport.yMin) / rect.height;
    const dx = (e.clientX - dragState.current.x) * scaleX;
    const dy = (e.clientY - dragState.current.y) * scaleY;
    setViewport({
      xMin: dragState.current.viewport.xMin - dx,
      xMax: dragState.current.viewport.xMax - dx,
      yMin: dragState.current.viewport.yMin + dy,
      yMax: dragState.current.viewport.yMax + dy,
    });
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  const { xMin, xMax, yMin, yMax } = viewport;
  const toPx = (x: number) => ((x - xMin) / (xMax - xMin)) * SIZE;
  const toPy = (y: number) => SIZE - ((y - yMin) / (yMax - yMin)) * SIZE;

  const xStep = niceStep(xMax - xMin);
  const yStep = niceStep(yMax - yMin);

  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.ceil(xMin / xStep) * xStep;
    for (let v = start; v <= xMax; v += xStep) {
      if (Math.abs(v) > 1e-9) ticks.push(v);
    }
    return ticks;
  }, [xMin, xMax, xStep]);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.ceil(yMin / yStep) * yStep;
    for (let v = start; v <= yMax; v += yStep) {
      if (Math.abs(v) > 1e-9) ticks.push(v);
    }
    return ticks;
  }, [yMin, yMax, yStep]);

  const curves = fns.map((fn) => {
    if (!fn.expr.trim()) return { fn, path: "", error: null };
    try {
      const evaluate = compileExpression(fn.expr);
      let path = "";
      let drawing = false;
      let prevPy: number | null = null;
      const samples = SIZE / 2;
      for (let i = 0; i <= samples; i++) {
        const px = (i / samples) * SIZE;
        const x = xMin + (px / SIZE) * (xMax - xMin);
        let y: number;
        try {
          y = evaluate(x);
        } catch {
          y = NaN;
        }
        const py = toPy(y);
        const finite = Number.isFinite(y);
        const jump = prevPy !== null && Math.abs(py - prevPy) > SIZE * 1.5;
        if (finite && !jump) {
          path += `${drawing ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)} `;
          drawing = true;
        } else {
          drawing = false;
        }
        prevPy = finite ? py : null;
      }
      return { fn, path, error: null };
    } catch (err) {
      return { fn, path: "", error: err instanceof MathExprError ? err.message : "Expressão inválida" };
    }
  });

  const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        {fns.map((fn, i) => {
          const curve = curves[i];
          return (
            <div key={fn.id} className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: fn.color }}
                aria-hidden
              />
              <span className="text-sm text-muted">y =</span>
              <input
                type="text"
                value={fn.expr}
                onChange={(e) => updateExpr(fn.id, e.target.value)}
                placeholder="ex: x^2 - 3x + 2"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {fns.length > 1 && (
                <button
                  onClick={() => removeFn(fn.id)}
                  aria-label="Remover função"
                  className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-error-bg hover:text-error"
                >
                  ✕
                </button>
              )}
              {curve.error && (
                <span className="hidden text-xs text-error sm:inline">{curve.error}</span>
              )}
            </div>
          );
        })}
        {fns.some((f) => curves.find((c) => c.fn.id === f.id)?.error) && (
          <div className="flex flex-col gap-1 sm:hidden">
            {curves
              .filter((c) => c.error)
              .map((c) => (
                <p key={c.fn.id} className="text-xs text-error">
                  {c.error}
                </p>
              ))}
          </div>
        )}
        {fns.length < CURVE_COLORS.length && (
          <button
            onClick={addFn}
            className="mt-1 self-start text-sm font-semibold text-primary hover:underline"
          >
            + Adicionar função
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={() => zoom(1.25)}
          aria-label="Diminuir zoom"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:border-primary hover:text-primary"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:border-primary hover:text-primary"
        >
          Redefinir
        </button>
        <button
          onClick={() => zoom(0.8)}
          aria-label="Aumentar zoom"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:border-primary hover:text-primary"
        >
          +
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full touch-none select-none bg-surface"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          role="img"
          aria-label="Gráfico de funções interativo. Arraste para navegar."
        >
          {xTicks.map((v) => (
            <line
              key={`gx${v}`}
              x1={toPx(v)}
              x2={toPx(v)}
              y1={0}
              y2={SIZE}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          ))}
          {yTicks.map((v) => (
            <line
              key={`gy${v}`}
              x1={0}
              x2={SIZE}
              y1={toPy(v)}
              y2={toPy(v)}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          ))}

          {yMin <= 0 && yMax >= 0 && (
            <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          )}
          {xMin <= 0 && xMax >= 0 && (
            <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="var(--color-muted)" strokeWidth={1.5} />
          )}

          {originVisible &&
            xTicks
              .filter((v) => v >= xMin + (xMax - xMin) * 0.03 && v <= xMax - (xMax - xMin) * 0.08)
              .map((v) => (
                <text
                  key={`tx${v}`}
                  x={toPx(v)}
                  y={toPy(0) + 14}
                  fontSize={11}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                >
                  {formatTick(v)}
                </text>
              ))}
          {originVisible &&
            yTicks
              .filter((v) => v >= yMin + (yMax - yMin) * 0.06 && v <= yMax - (yMax - yMin) * 0.03)
              .map((v) => (
                <text key={`ty${v}`} x={toPx(0) + 6} y={toPy(v) + 4} fontSize={11} fill="var(--color-muted)">
                  {formatTick(v)}
                </text>
              ))}

          {curves.map(
            (c) =>
              c.path && (
                <path key={c.fn.id} d={c.path} fill="none" stroke={c.fn.color} strokeWidth={2.5} />
              )
          )}
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 320;
const RANGE = 6;
const MARGIN = 24;

function toX(re: number): number {
  return MARGIN + ((re + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}
function toY(im: number): number {
  return HEIGHT - MARGIN - ((im + RANGE) / (2 * RANGE)) * (HEIGHT - 2 * MARGIN);
}

export default function ComplexPlaneExplorer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  const modulus = Math.sqrt(a * a + b * b);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        z = {a} {b >= 0 ? "+" : "−"} {Math.abs(b)}i · |z| = {formatNumber(modulus)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Parte real (a): {a}</span>
          <input
            type="range"
            min={-RANGE}
            max={RANGE}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Parte real de z"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Parte imaginária (b): {b}</span>
          <input
            type="range"
            min={-RANGE}
            max={RANGE}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Parte imaginária de z"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="aspect-square w-full"
          role="img"
          aria-label={`Plano de Argand com o ponto z = ${a} + ${b}i, módulo ${formatNumber(modulus)}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="#898781" strokeWidth={1} />
          <line x1={WIDTH / 2} x2={WIDTH / 2} y1={MARGIN} y2={HEIGHT - MARGIN} stroke="#898781" strokeWidth={1} />
          <text x={WIDTH - MARGIN + 4} y={HEIGHT / 2 + 4} fontSize={11} fill="#898781">
            Re
          </text>
          <text x={WIDTH / 2 + 6} y={MARGIN - 6} fontSize={11} fill="#898781">
            Im
          </text>
          <line x1={toX(0)} x2={toX(a)} y1={toY(0)} y2={toY(b)} stroke="#2a78d6" strokeWidth={2} markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#2a78d6" />
            </marker>
          </defs>
          <circle cx={toX(a)} cy={toY(b)} r={6} fill="#e34948" />
          <text x={toX(a) + 10} y={toY(b) - 8} fontSize={12} fontWeight={700} fill="#e34948">
            z = {a}{b >= 0 ? "+" : "−"}{Math.abs(b)}i
          </text>
        </svg>
      </div>
      <p className="mt-3 text-sm text-foreground">
        |z| = √(a² + b²) = √({a}² + {b}²) = √{a * a + b * b} = {formatNumber(modulus)} — a distância do ponto
        até a origem.
      </p>
    </div>
  );
}

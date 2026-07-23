"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 140;

export default function EquationBalanceExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(11);

  const x = (c - b) / a;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {a}x {b >= 0 ? "+" : "−"} {Math.abs(b)} = {c} → x = {formatNumber(x)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Coeficiente (a): {a}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente de x"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Constante (b): {b}</span>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Constante somada a ax"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Lado direito (c): {c}</span>
          <input
            type="range"
            min={-20}
            max={20}
            step={1}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor do lado direito da equação"
          />
        </label>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-xl border border-border bg-surface"
        role="img"
        aria-label={`Balança equilibrada: ${a}x + ${b} de um lado, ${c} do outro, resultando em x = ${formatNumber(x)}`}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-32 w-full">
          <polygon points="150,20 170,20 160,5" fill="var(--color-muted)" />
          <line x1={160} x2={160} y1={20} y2={45} stroke="var(--color-muted)" strokeWidth={3} />
          <line x1={50} x2={270} y1={45} y2={45} stroke="var(--color-muted)" strokeWidth={3} />
          <line x1={50} x2={50} y1={45} y2={70} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={270} x2={270} y1={45} y2={70} stroke="var(--color-muted)" strokeWidth={1.5} />
          <rect x={15} y={70} width={70} height={40} rx={6} fill="#2a78d6" fillOpacity={0.2} stroke="#2a78d6" strokeWidth={2} />
          <text x={50} y={95} fontSize={14} fontWeight={700} fill="#2a78d6" textAnchor="middle">
            {a}x {b >= 0 ? "+" : "−"} {Math.abs(b)}
          </text>
          <rect x={235} y={70} width={70} height={40} rx={6} fill="#1baf7a" fillOpacity={0.2} stroke="#1baf7a" strokeWidth={2} />
          <text x={270} y={95} fontSize={14} fontWeight={700} fill="#1baf7a" textAnchor="middle">
            {c}
          </text>
        </svg>
      </div>
      <p className="mt-3 text-sm text-foreground">
        Isolando x: {a}x = {c} {b >= 0 ? "−" : "+"} {Math.abs(b)} = {c - b} → x = {c - b} ÷ {a} = {formatNumber(x)}
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const WIDTH = 320;
const HEIGHT = 100;
const MARGIN = 24;
const RANGE = 15;

function toX(value: number): number {
  return MARGIN + ((value + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}

export default function IntegerLineExplorer() {
  const [start, setStart] = useState(-4);
  const [step, setStep] = useState(7);

  const result = start + step;

  const ticks = useMemo(() => {
    const values: number[] = [];
    for (let v = -RANGE; v <= RANGE; v += 5) values.push(v);
    return values;
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {start} {step >= 0 ? "+" : "−"} {Math.abs(step)} = {result}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Ponto de partida: {start}</span>
          <input
            type="range"
            min={-RANGE}
            max={RANGE}
            step={1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Ponto de partida na reta numérica"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Passo (soma): {step}</span>
          <input
            type="range"
            min={-RANGE}
            max={RANGE}
            step={1}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Passo somado ao ponto de partida"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-24 w-full"
          role="img"
          aria-label={`Reta numérica: partindo de ${start}, um passo de ${step} chega em ${result}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="var(--color-muted)" strokeWidth={1.5} />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={toX(t)} x2={toX(t)} y1={HEIGHT / 2 - 4} y2={HEIGHT / 2 + 4} stroke="var(--color-muted)" strokeWidth={1} />
              <text x={toX(t)} y={HEIGHT / 2 + 18} fontSize={10} fill="var(--color-muted)" textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <line
            x1={toX(start)}
            x2={toX(result)}
            y1={HEIGHT / 2 - 20}
            y2={HEIGHT / 2 - 20}
            stroke="#2a78d6"
            strokeWidth={2.5}
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#2a78d6" />
            </marker>
          </defs>
          <circle cx={toX(start)} cy={HEIGHT / 2} r={5} fill="var(--color-muted)" />
          <circle cx={toX(result)} cy={HEIGHT / 2} r={6} fill="#e34948" />
        </svg>
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" aria-hidden /> Partida
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#e34948]" aria-hidden /> Resultado
        </span>
      </div>
    </div>
  );
}

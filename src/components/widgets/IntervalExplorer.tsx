"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const MIN = -10;
const MAX = 10;
const WIDTH = 300;

function toX(v: number): number {
  return ((v - MIN) / (MAX - MIN)) * WIDTH;
}

export default function IntervalExplorer() {
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(5);
  const [a2, setA2] = useState(3);
  const [b2, setB2] = useState(8);

  const interStart = Math.max(a1, a2);
  const interEnd = Math.min(b1, b2);
  const hasIntersection = interStart <= interEnd;

  const unionStart = Math.min(a1, a2);
  const unionEnd = Math.max(b1, b2);
  const unionIsSingleInterval = interStart <= interEnd;

  function updateA1(next: number) {
    setA1(Math.min(next, b1));
  }
  function updateB1(next: number) {
    setB1(Math.max(next, a1));
  }
  function updateA2(next: number) {
    setA2(Math.min(next, b2));
  }
  function updateB2(next: number) {
    setB2(Math.max(next, a2));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        [{a1},{b1}] ∩ [{a2},{b2}] = {hasIntersection ? `[${interStart},${interEnd}]` : "∅"}
      </p>
      <p className="mt-1 text-sm text-muted">
        União ={" "}
        {unionIsSingleInterval
          ? `[${unionStart},${unionEnd}]`
          : `[${a1},${b1}]∪[${a2},${b2}]`}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a1: {a1}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={a1}
            onChange={(e) => updateA1(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Início do intervalo 1 (a1)"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b1: {b1}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={b1}
            onChange={(e) => updateB1(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Fim do intervalo 1 (b1)"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a2: {a2}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={a2}
            onChange={(e) => updateA2(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Início do intervalo 2 (a2)"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b2: {b2}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={b2}
            onChange={(e) => updateB2(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Fim do intervalo 2 (b2)"
          />
        </label>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-xl border border-border"
        role="img"
        aria-label={`Reta numérica com intervalo 1 [${a1},${b1}] e intervalo 2 [${a2},${b2}], interseção ${
          hasIntersection ? `[${interStart},${interEnd}]` : "vazia"
        }`}
      >
        <svg viewBox={`0 0 ${WIDTH} 90`} className="h-full w-full bg-surface">
          <line x1={0} y1={70} x2={WIDTH} y2={70} stroke="var(--color-muted)" strokeWidth={1.5} />
          {Array.from({ length: (MAX - MIN) / 2 + 1 }, (_, i) => MIN + i * 2).map((v) => (
            <line key={v} x1={toX(v)} y1={65} x2={toX(v)} y2={75} stroke="var(--color-muted)" strokeWidth={1} />
          ))}

          <line x1={toX(a1)} y1={20} x2={toX(b1)} y2={20} stroke="#2a78d6" strokeWidth={6} strokeLinecap="round" />
          <line x1={toX(a2)} y1={40} x2={toX(b2)} y2={40} stroke="#1baf7a" strokeWidth={6} strokeLinecap="round" />
          {hasIntersection && (
            <line
              x1={toX(interStart)}
              y1={55}
              x2={toX(interEnd)}
              y2={55}
              stroke="#8a63d2"
              strokeWidth={6}
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste os intervalos até que a interseção seja vazia (∅)."
        isMet={!hasIntersection}
      />
    </div>
  );
}

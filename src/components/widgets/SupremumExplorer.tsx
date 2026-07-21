"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const MIN = -10;
const MAX = 10;
const WIDTH = 300;

function toX(v: number): number {
  return ((v - MIN) / (MAX - MIN)) * WIDTH;
}

export default function SupremumExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(6);
  const [candidate, setCandidate] = useState(8);

  function updateA(next: number) {
    setA(Math.min(next, b - 1));
  }
  function updateB(next: number) {
    setB(Math.max(next, a + 1));
  }

  const isUpperBound = candidate >= b;
  const isSupremum = candidate === b;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        A = ({a}, {b}) · candidato de cota superior = {candidate}
      </p>
      <p className="mt-1 text-sm text-muted">
        {isSupremum
          ? `${candidate} é o supremo de A — a menor cota superior possível.`
          : isUpperBound
            ? `${candidate} é uma cota superior de A, mas não a menor (o supremo é ${b}).`
            : `${candidate} NÃO é cota superior de A (existem elementos de A maiores que ${candidate}).`}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Início (a): {a}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={a}
            onChange={(e) => updateA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Início do conjunto A"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Fim (b): {b}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={b}
            onChange={(e) => updateB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Fim do conjunto A"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Candidato: {candidate}</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={candidate}
            onChange={(e) => setCandidate(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Candidato a cota superior"
          />
        </label>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-xl border border-border"
        role="img"
        aria-label={`Reta numérica com o conjunto aberto A=(${a},${b}) e um candidato a cota superior em ${candidate}`}
      >
        <svg viewBox={`0 0 ${WIDTH} 70`} className="h-full w-full bg-surface">
          <line x1={0} y1={50} x2={WIDTH} y2={50} stroke="var(--color-muted)" strokeWidth={1.5} />
          {Array.from({ length: (MAX - MIN) / 2 + 1 }, (_, i) => MIN + i * 2).map((v) => (
            <line key={v} x1={toX(v)} y1={45} x2={toX(v)} y2={55} stroke="var(--color-muted)" strokeWidth={1} />
          ))}
          <line x1={toX(a)} y1={25} x2={toX(b)} y2={25} stroke="#2a78d6" strokeWidth={6} strokeLinecap="round" />
          <circle
            cx={toX(candidate)}
            cy={25}
            r={5}
            fill={isSupremum ? "#1baf7a" : isUpperBound ? "#e3a548" : "#e34948"}
          />
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste o candidato até que ele seja exatamente o supremo de A (a menor cota superior), sem pertencer ao conjunto."
        isMet={isSupremum}
      />
    </div>
  );
}

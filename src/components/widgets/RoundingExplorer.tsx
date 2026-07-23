"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 100;
const MARGIN = 28;

type Place = "dezena" | "centena" | "milhar";
const FACTORS: Record<Place, number> = { dezena: 10, centena: 100, milhar: 1000 };
const BUTTON_LABELS: Record<Place, string> = { dezena: "Dezena", centena: "Centena", milhar: "Milhar" };
const PHRASES: Record<Place, string> = {
  dezena: "a dezena mais próxima",
  centena: "a centena mais próxima",
  milhar: "o milhar mais próximo",
};

export default function RoundingExplorer() {
  const [value, setValue] = useState(347);
  const [place, setPlace] = useState<Place>("centena");

  const factor = FACTORS[place];
  const lower = Math.floor(value / factor) * factor;
  const upper = lower + factor;
  const rounded = Math.round(value / factor) * factor;

  function toX(n: number): number {
    return MARGIN + ((n - lower) / factor) * (WIDTH - 2 * MARGIN);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {value} arredondado para {PHRASES[place]} = {rounded}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Número: {value}</span>
          <input
            type="range"
            min={0}
            max={9999}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número a arredondar"
          />
        </label>
        <div className="flex gap-2" role="group" aria-label="Escolha a casa de arredondamento">
          {(Object.keys(FACTORS) as Place[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlace(p)}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                place === p ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
              }`}
            >
              {BUTTON_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-24 w-full"
          role="img"
          aria-label={`Reta numérica entre ${lower} e ${upper}: ${value} arredonda para ${rounded}`}
        >
          <line
            x1={MARGIN}
            x2={WIDTH - MARGIN}
            y1={HEIGHT / 2}
            y2={HEIGHT / 2}
            stroke="var(--color-muted)"
            strokeWidth={1.5}
          />
          {[lower, upper].map((n) => (
            <g key={n}>
              <line
                x1={toX(n)}
                x2={toX(n)}
                y1={HEIGHT / 2 - 6}
                y2={HEIGHT / 2 + 6}
                stroke="var(--color-muted)"
                strokeWidth={1.5}
              />
              <text x={toX(n)} y={HEIGHT / 2 + 22} fontSize={11} fill="var(--color-muted)" textAnchor="middle">
                {n}
              </text>
            </g>
          ))}
          <circle cx={toX(value)} cy={HEIGHT / 2} r={6} fill="#e34948" />
          <circle cx={toX(rounded)} cy={HEIGHT / 2 - 20} r={5} fill="#2a78d6" />
          <text x={toX(rounded)} y={HEIGHT / 2 - 28} fontSize={11} fill="#2a78d6" textAnchor="middle">
            {rounded}
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste o número para que ele arredonde para 500 na centena mais próxima."
        isMet={place === "centena" && rounded === 500}
      />
    </div>
  );
}

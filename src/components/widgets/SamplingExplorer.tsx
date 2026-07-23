"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const POPULATION = [50, 38, 47, 41, 44, 46, 43, 51];
const POPULATION_MEAN = POPULATION.reduce((a, b) => a + b, 0) / POPULATION.length;

const WIDTH = 300;
const HEIGHT = 140;
const BAR_GAP = 6;
const BAR_WIDTH = (WIDTH - BAR_GAP * (POPULATION.length - 1)) / POPULATION.length;
const MAX_VALUE = Math.max(...POPULATION);

function barHeight(value: number): number {
  return (value / MAX_VALUE) * (HEIGHT - 20);
}

export default function SamplingExplorer() {
  const [n, setN] = useState(3);

  const sampleMean = useMemo(() => {
    const s = POPULATION.slice(0, n);
    return s.reduce((a, b) => a + b, 0) / s.length;
  }, [n]);

  const diff = sampleMean - POPULATION_MEAN;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Amostra (n={n}): média = {formatNumber(sampleMean)} · população: média = {formatNumber(POPULATION_MEAN)} ·
        erro = {formatNumber(diff)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Tamanho da amostra: {n}</span>
          <input
            type="range"
            min={1}
            max={POPULATION.length}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tamanho da amostra (n)"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`População de 8 valores; os primeiros ${n} formam a amostra, com média ${formatNumber(sampleMean)} contra a média populacional ${formatNumber(POPULATION_MEAN)}`}
        >
          <line
            x1={0}
            x2={WIDTH}
            y1={HEIGHT - barHeight(POPULATION_MEAN) - 10}
            y2={HEIGHT - barHeight(POPULATION_MEAN) - 10}
            stroke="var(--color-muted)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          {POPULATION.map((value, i) => {
            const inSample = i < n;
            const x = i * (BAR_WIDTH + BAR_GAP);
            const h = barHeight(value);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={HEIGHT - h - 10}
                  width={BAR_WIDTH}
                  height={h}
                  rx={4}
                  fill={inSample ? "#2a78d6" : "var(--color-border)"}
                  fillOpacity={inSample ? 0.85 : 1}
                />
                <text x={x + BAR_WIDTH / 2} y={HEIGHT - 1} fontSize={9} fill="var(--color-muted)" textAnchor="middle">
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Barras azuis: os {n} valores da amostra. Linha tracejada: média da população (
        {formatNumber(POPULATION_MEAN)}). Conforme n cresce, a média da amostra tende a se aproximar dela.
      </p>
    </div>
  );
}

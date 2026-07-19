"use client";

import { useState } from "react";

const WIDTH = 260;
const HEIGHT = 130;
const MARGIN_BOTTOM = 24;

function diagnose(train: number, test: number): string {
  if (train - test > 15) return "Overfitting — decorou o treino, generaliza mal";
  if (train < 70 && test < 70) return "Underfitting — modelo simples demais";
  return "Bom ajuste — treino e teste próximos e altos";
}

export default function OverfittingExplorer() {
  const [train, setTrain] = useState(95);
  const [test, setTest] = useState(60);

  const diagnosis = diagnose(train, test);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">{diagnosis}</p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Acurácia no treino: {train}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={train}
            onChange={(e) => setTrain(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Acurácia no conjunto de treino"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Acurácia no teste: {test}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={test}
            onChange={(e) => setTest(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Acurácia no conjunto de teste"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-32 w-full"
          role="img"
          aria-label={`Acurácia de treino ${train}% vs teste ${test}%: ${diagnosis}`}
        >
          <line x1={0} x2={WIDTH} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="#898781" strokeWidth={1.5} />
          {[
            { label: "Treino", value: train, color: "#2a78d6" },
            { label: "Teste", value: test, color: "#e34948" },
          ].map((bar, i) => {
            const barWidth = 70;
            const x = 30 + i * (barWidth + 60);
            const barHeight = (bar.value / 100) * (HEIGHT - MARGIN_BOTTOM - 10);
            return (
              <g key={i}>
                <rect x={x} y={HEIGHT - MARGIN_BOTTOM - barHeight} width={barWidth} height={barHeight} fill={bar.color} fillOpacity={0.7} />
                <text x={x + barWidth / 2} y={HEIGHT - MARGIN_BOTTOM + 16} fontSize={11} fill="#3d3b47" textAnchor="middle">
                  {bar.label} {bar.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 260;
const HEIGHT = 130;
const MARGIN_BOTTOM = 24;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function PresentValueExplorer() {
  const [futureValue, setFutureValue] = useState(1210);
  const [rate, setRate] = useState(10);
  const [periods, setPeriods] = useState(2);

  const presentValue = futureValue / (1 + rate / 100) ** periods;
  const maxValue = Math.max(futureValue, presentValue, 1);

  const bars = [
    { label: "Valor Futuro", value: futureValue, color: "var(--color-muted)" },
    { label: "Valor Presente", value: presentValue, color: "#2a78d6" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        VP = R$ {formatCurrency(presentValue)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Valor futuro: R$ {futureValue}</span>
          <input
            type="range"
            min={100}
            max={5000}
            step={10}
            value={futureValue}
            onChange={(e) => setFutureValue(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor futuro"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Taxa: {rate}% a.m.</span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Taxa de juros ao mês"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Períodos: {periods}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={periods}
            onChange={(e) => setPeriods(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de períodos"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-32 w-full"
          role="img"
          aria-label={`Valor futuro R$${futureValue} vs valor presente R$${formatCurrency(presentValue)}`}
        >
          <line x1={0} x2={WIDTH} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          {bars.map((bar, i) => {
            const barWidth = 70;
            const x = 30 + i * (barWidth + 60);
            const barHeight = (bar.value / maxValue) * (HEIGHT - MARGIN_BOTTOM - 10);
            return (
              <g key={i}>
                <rect x={x} y={HEIGHT - MARGIN_BOTTOM - barHeight} width={barWidth} height={barHeight} fill={bar.color} fillOpacity={0.7} />
                <text x={x + barWidth / 2} y={HEIGHT - MARGIN_BOTTOM + 16} fontSize={10} fill="var(--color-muted)" textAnchor="middle">
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        VP = VF / (1+i)ⁿ = {futureValue} / (1+{formatNumber(rate / 100)})^{periods} = R${" "}
        {formatCurrency(presentValue)}.
      </p>
    </div>
  );
}

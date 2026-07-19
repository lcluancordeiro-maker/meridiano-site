"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 300;
const HEIGHT = 130;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function InflationErosionExplorer() {
  const [value, setValue] = useState(1000);
  const [inflation, setInflation] = useState(10);
  const [years, setYears] = useState(1);

  const corrected = value * (1 + inflation / 100) ** years;
  const realPower = value / (1 + inflation / 100) ** years;
  const maxValue = Math.max(value, corrected, 1);

  const bars = [
    { label: "Valor original", value, color: "var(--color-muted)" },
    { label: "Corrigido pela inflação", value: corrected, color: "#2a78d6" },
    { label: "Poder de compra se não corrigido", value: realPower, color: "#e34948" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        R$ {value} → corrigido R$ {formatCurrency(corrected)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Valor: R$ {value}</span>
          <input
            type="range"
            min={100}
            max={5000}
            step={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor nominal original"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Inflação: {inflation}% a.a.</span>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={inflation}
            onChange={(e) => setInflation(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Taxa de inflação ao ano"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Períodos: {years} anos</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de períodos, em anos"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-32 w-full"
          role="img"
          aria-label={`Comparação entre valor original R$${value}, corrigido R$${formatCurrency(corrected)} e poder de compra sem correção R$${formatCurrency(realPower)}`}
        >
          {bars.map((bar, i) => {
            const barWidth = (bar.value / maxValue) * (WIDTH - 20);
            const y = 10 + i * 38;
            return (
              <g key={i}>
                <rect x={10} y={y} width={barWidth} height={22} rx={4} fill={bar.color} fillOpacity={0.7} />
                <text x={16} y={y + 15} fontSize={10} fill="white" fontWeight={700}>
                  R$ {formatCurrency(bar.value)}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-col gap-1 text-xs text-foreground">
          {bars.map((bar, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bar.color }} aria-hidden />
              {bar.label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground">
        valor corrigido = {value} × (1+{formatNumber(inflation / 100)})^{years} = R$ {formatCurrency(corrected)}.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 140;
const MARGIN_BOTTOM = 24;
const MARGIN_TOP = 10;

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function SimpleInterestExplorer() {
  const [capital, setCapital] = useState(1000);
  const [rate, setRate] = useState(2);
  const [time, setTime] = useState(5);

  const juros = capital * (rate / 100) * time;
  const montante = capital + juros;

  const points = useMemo(() => {
    const list: { t: number; m: number }[] = [];
    for (let t = 0; t <= time; t++) {
      list.push({ t, m: capital + capital * (rate / 100) * t });
    }
    return list;
  }, [capital, rate, time]);

  const maxValue = Math.max(montante, 1);
  function toX(t: number): number {
    return MARGIN_TOP + (t / Math.max(time, 1)) * (WIDTH - 2 * MARGIN_TOP);
  }
  function toY(value: number): number {
    return HEIGHT - MARGIN_BOTTOM - (value / maxValue) * (HEIGHT - MARGIN_BOTTOM - MARGIN_TOP);
  }
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.t)},${toY(p.m)}`).join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        J = R$ {formatCurrency(juros)} · M = R$ {formatCurrency(montante)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Capital: R$ {capital}</span>
          <input
            type="range"
            min={100}
            max={5000}
            step={100}
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Capital inicial"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Taxa: {formatNumber(rate)}% a.m.</span>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Taxa de juros ao mês"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Tempo: {time} meses</span>
          <input
            type="range"
            min={1}
            max={24}
            step={1}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tempo em meses"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Crescimento linear do montante de R$${capital} até R$${formatCurrency(montante)} em ${time} meses`}
        >
          <line x1={MARGIN_TOP} x2={WIDTH - MARGIN_TOP} y1={HEIGHT - MARGIN_BOTTOM} y2={HEIGHT - MARGIN_BOTTOM} stroke="var(--color-muted)" strokeWidth={1.5} />
          <path d={linePath} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toX(time)} cy={toY(montante)} r={5} fill="#e34948" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        J = C × i × t = {capital} × {formatNumber(rate / 100)} × {time} = R$ {formatCurrency(juros)} — o
        crescimento é sempre uma reta, porque o juro incide só sobre o capital inicial.
      </p>
    </div>
  );
}

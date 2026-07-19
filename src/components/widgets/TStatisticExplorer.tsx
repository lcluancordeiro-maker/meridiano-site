"use client";

import { formatNumber } from "./svgUtils";
import { useState } from "react";

const WIDTH = 320;
const HEIGHT = 90;
const MARGIN = 24;
const RANGE = 6;
const CRITICAL = 2;

function toX(t: number): number {
  return MARGIN + ((t + RANGE) / (2 * RANGE)) * (WIDTH - 2 * MARGIN);
}

export default function TStatisticExplorer() {
  const [betaHat, setBetaHat] = useState(6);
  const [stdError, setStdError] = useState(3);

  const t = betaHat / stdError;
  const significant = Math.abs(t) > CRITICAL;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        t = {formatNumber(betaHat)} / {formatNumber(stdError)} = {formatNumber(t)} →{" "}
        {significant ? "significante" : "não significante"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">β̂: {betaHat}</span>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={betaHat}
            onChange={(e) => setBetaHat(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente estimado, β̂"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Erro-padrão: {stdError}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={stdError}
            onChange={(e) => setStdError(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Erro-padrão do coeficiente"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-20 w-full"
          role="img"
          aria-label={`Reta com t=${formatNumber(t)} comparado ao valor crítico ±${CRITICAL}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="#898781" strokeWidth={1.5} />
          <rect x={toX(-RANGE)} y={HEIGHT / 2 - 10} width={toX(-CRITICAL) - toX(-RANGE)} height={20} fill="#e34948" fillOpacity={0.15} />
          <rect x={toX(CRITICAL)} y={HEIGHT / 2 - 10} width={toX(RANGE) - toX(CRITICAL)} height={20} fill="#e34948" fillOpacity={0.15} />
          <line x1={toX(-CRITICAL)} x2={toX(-CRITICAL)} y1={10} y2={HEIGHT - 10} stroke="#e34948" strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={toX(CRITICAL)} x2={toX(CRITICAL)} y1={10} y2={HEIGHT - 10} stroke="#e34948" strokeWidth={1.5} strokeDasharray="3 3" />
          <circle cx={toX(Math.max(-RANGE, Math.min(RANGE, t)))} cy={HEIGHT / 2} r={6} fill={significant ? "#1baf7a" : "#898781"} />
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Zonas vermelhas: |t| &gt; {CRITICAL} (regra prática para 5% de significância). O ponto{" "}
        {significant ? "verde cai fora da faixa central" : "cinza fica dentro da faixa central"}.
      </p>
    </div>
  );
}

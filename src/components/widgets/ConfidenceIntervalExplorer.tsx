"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const WIDTH = 320;
const HEIGHT = 90;
const MARGIN = 24;

const Z_SCORES: Record<string, number> = {
  "90": 1.645,
  "95": 1.96,
  "99": 2.576,
};

export default function ConfidenceIntervalExplorer() {
  const [mean, setMean] = useState(100);
  const [sigma, setSigma] = useState(15);
  const [n, setN] = useState(25);
  const [confidence, setConfidence] = useState<"90" | "95" | "99">("95");

  const z = Z_SCORES[confidence];
  const marginOfError = z * (sigma / Math.sqrt(n));
  const lower = mean - marginOfError;
  const upper = mean + marginOfError;

  const domainMin = mean - sigma * 2;
  const domainMax = mean + sigma * 2;
  function toX(value: number): number {
    const clamped = Math.min(domainMax, Math.max(domainMin, value));
    return MARGIN + ((clamped - domainMin) / (domainMax - domainMin)) * (WIDTH - 2 * MARGIN);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        [{formatNumber(lower)}, {formatNumber(upper)}] · margem = ±{formatNumber(marginOfError)}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Média amostral (x̄): {mean}</span>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Média amostral"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Desvio padrão (σ): {sigma}</span>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Desvio padrão"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Tamanho da amostra (n): {n}</span>
          <input
            type="range"
            min={4}
            max={100}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Tamanho da amostra"
          />
        </label>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Confiança:</span>
          <div className="flex gap-2">
            {(["90", "95", "99"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setConfidence(level)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  confidence === level
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-foreground hover:bg-background"
                }`}
                aria-pressed={confidence === level}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-20 w-full"
          role="img"
          aria-label={`Intervalo de confiança de ${confidence}%: de ${formatNumber(lower)} a ${formatNumber(upper)}, centrado em ${mean}`}
        >
          <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT / 2} y2={HEIGHT / 2} stroke="#898781" strokeWidth={1.5} />
          <line
            x1={toX(lower)}
            x2={toX(upper)}
            y1={HEIGHT / 2}
            y2={HEIGHT / 2}
            stroke="#2a78d6"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle cx={toX(mean)} cy={HEIGHT / 2} r={6} fill="#e34948" />
          <text x={toX(lower)} y={HEIGHT / 2 + 24} fontSize={11} fill="#3d3b47" textAnchor="middle">
            {formatNumber(lower)}
          </text>
          <text x={toX(upper)} y={HEIGHT / 2 + 24} fontSize={11} fill="#3d3b47" textAnchor="middle">
            {formatNumber(upper)}
          </text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-foreground">
        E = z × (σ/√n) = {formatNumber(z)} × ({sigma}/√{n}) = {formatNumber(marginOfError)}.
      </p>
    </div>
  );
}

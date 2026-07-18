"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 240;
const TOP_Y = 40;
const RY_RATIO = 0.35;
const H_SCALE = 15;

export default function Solid3DExplorer() {
  const [r, setR] = useState(3);
  const [h, setH] = useState(5);

  const rPx = r * 14;
  const ryPx = rPx * RY_RATIO;
  const bottomY = TOP_Y + h * H_SCALE;
  const cx = WIDTH / 2;

  const volumeCoefficient = r * r * h;
  const lateralCoefficient = 2 * r * h;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Volume = πr²h = π×{r}²×{h} = {formatNumber(volumeCoefficient)}π
      </p>
      <p className="mt-1 text-sm text-muted">
        Área lateral = 2πrh = {formatNumber(lateralCoefficient)}π
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Raio (r): {r}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Raio do cilindro"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Altura (h): {h}</span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Altura do cilindro"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <svg
          viewBox={`0 0 ${WIDTH} ${TOP_Y + 8 * H_SCALE + 20}`}
          className="h-full w-full bg-white"
          role="img"
          aria-label={`Cilindro com raio ${r} e altura ${h}`}
        >
          <line x1={cx - rPx} y1={TOP_Y} x2={cx - rPx} y2={bottomY} stroke="#2a78d6" strokeWidth={2} />
          <line x1={cx + rPx} y1={TOP_Y} x2={cx + rPx} y2={bottomY} stroke="#2a78d6" strokeWidth={2} />
          <path
            d={`M${cx - rPx},${bottomY} A${rPx},${ryPx} 0 1 0 ${cx + rPx},${bottomY}`}
            fill="none"
            stroke="#2a78d6"
            strokeWidth={2}
          />
          <path
            d={`M${cx - rPx},${bottomY} A${rPx},${ryPx} 0 0 1 ${cx + rPx},${bottomY}`}
            fill="none"
            stroke="#2a78d6"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <ellipse cx={cx} cy={TOP_Y} rx={rPx} ry={ryPx} fill="#e8f1fc" stroke="#2a78d6" strokeWidth={2} />
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste r e h até que o volume seja igual a 50π."
        isMet={r * r * h === 50}
      />
    </div>
  );
}

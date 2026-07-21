"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 280;
const HEIGHT = 280;
const MARGIN = 20;
const MAX_RADIUS = 12;
const SCALE = (Math.min(WIDTH, HEIGHT) - 2 * MARGIN) / (2 * MAX_RADIUS);
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

export default function CircularSectorExplorer() {
  const [radius, setRadius] = useState(8);
  const [angle, setAngle] = useState(90);

  const angleRad = (angle * Math.PI) / 180;
  const area = Math.round(((angle / 360) * Math.PI * radius * radius) * 100) / 100;
  const arcLength = Math.round(((angle / 360) * 2 * Math.PI * radius) * 100) / 100;

  const r = radius * SCALE;
  const x1 = CX + r;
  const y1 = CY;
  const x2 = CX + r * Math.cos(angleRad);
  const y2 = CY - r * Math.sin(angleRad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const path = `M ${CX},${CY} L ${x1},${y1} A ${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Área do setor ≈ {area} · Comprimento do arco ≈ {arcLength}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Raio: {radius}</span>
          <input
            type="range"
            min={2}
            max={MAX_RADIUS}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Raio do círculo"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Ângulo: {angle}°</span>
          <input
            type="range"
            min={10}
            max={350}
            step={5}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Ângulo central do setor"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full"
          role="img"
          aria-label={`Setor circular de raio ${radius} e ângulo ${angle} graus, com área aproximada ${area} e arco aproximado ${arcLength}`}
        >
          <circle cx={CX} cy={CY} r={r} fill="none" stroke="var(--color-border)" strokeWidth={1.5} />
          <path d={path} fill="var(--color-primary)" fillOpacity={0.2} stroke="var(--color-primary)" strokeWidth={2} />
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste para um setor com área aproximadamente igual a 6π (≈18,85), usando raio 6."
        isMet={radius === 6 && angle === 60}
      />
    </div>
  );
}

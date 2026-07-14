"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS_PX = 110;

function toPx(x: number): number {
  return CENTER + x * RADIUS_PX;
}

function toPy(y: number): number {
  return CENTER - y * RADIUS_PX;
}

export default function UnitCircleExplorer() {
  const [angleDeg, setAngleDeg] = useState(30);
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const tanDefined = Math.abs(cos) > 0.001;
  const tan = tanDefined ? sin / cos : null;

  const px = toPx(cos);
  const py = toPy(sin);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">θ = {angleDeg}°</p>
      <p className="mt-1 text-sm text-muted">
        sen(θ) = {formatNumber(sin)} · cos(θ) = {formatNumber(cos)} ·{" "}
        {tanDefined ? `tan(θ) = ${formatNumber(tan!)}` : "tan(θ) indefinida"}
      </p>

      <label className="mt-4 flex items-center gap-3 text-sm text-foreground">
        <span className="w-24 shrink-0 font-medium">Ângulo θ: {angleDeg}°</span>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="flex-1 accent-[var(--color-primary)]"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-white"
          role="img"
          aria-label={`Círculo trigonométrico com ângulo de ${angleDeg} graus`}
        >
          <line x1={0} x2={SIZE} y1={CENTER} y2={CENTER} stroke="#898781" strokeWidth={1.5} />
          <line x1={CENTER} x2={CENTER} y1={0} y2={SIZE} stroke="#898781" strokeWidth={1.5} />
          <circle cx={CENTER} cy={CENTER} r={RADIUS_PX} fill="none" stroke="#c9c7db" strokeWidth={1.5} />
          <line x1={CENTER} y1={CENTER} x2={px} y2={CENTER} stroke="#1baf7a" strokeWidth={2.5} strokeDasharray="4 3" />
          <line x1={px} y1={CENTER} x2={px} y2={py} stroke="#e34948" strokeWidth={2.5} strokeDasharray="4 3" />
          <line x1={CENTER} y1={CENTER} x2={px} y2={py} stroke="#2a78d6" strokeWidth={2} />
          <circle cx={px} cy={py} r={5} fill="#2a78d6" />
        </svg>
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#1baf7a]" aria-hidden /> cos(θ)
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full bg-[#e34948]" aria-hidden /> sen(θ)
        </span>
      </div>
    </div>
  );
}

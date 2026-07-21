"use client";

import { useState } from "react";
import { RANGE, SIZE, TICKS, formatNumber, toPx, toPy } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

export default function LinearSystemExplorer() {
  const [m1, setM1] = useState(1);
  const [b1, setB1] = useState(2);
  const [m2, setM2] = useState(-1);
  const [b2, setB2] = useState(2);

  const parallel = m1 === m2;
  const coincident = parallel && b1 === b2;
  const intersectionX = parallel ? null : (b2 - b1) / (m1 - m2);
  const intersectionY = intersectionX === null ? null : m1 * intersectionX + b1;

  const line1Path = `M${toPx(-RANGE)},${toPy(m1 * -RANGE + b1)} L${toPx(RANGE)},${toPy(m1 * RANGE + b1)}`;
  const line2Path = `M${toPx(-RANGE)},${toPy(m2 * -RANGE + b2)} L${toPx(RANGE)},${toPy(m2 * RANGE + b2)}`;

  const sliders = [
    { key: "m1", label: "reta 1 — m₁", value: m1, setValue: setM1 },
    { key: "b1", label: "reta 1 — b₁", value: b1, setValue: setB1 },
    { key: "m2", label: "reta 2 — m₂", value: m2, setValue: setM2 },
    { key: "b2", label: "reta 2 — b₂", value: b2, setValue: setB2 },
  ];

  const statusText = coincident
    ? "Retas coincidentes — infinitas soluções."
    : parallel
      ? "Retas paralelas — sem solução."
      : `Solução única: x=${formatNumber(intersectionX!)}, y=${formatNumber(intersectionY!)}.`;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        y = {m1}x + {b1} · y = {m2}x + {b2}
      </p>
      <p className="mt-1 text-sm text-muted">{statusText}</p>

      <div className="mt-4 flex flex-col gap-3">
        {sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-28 shrink-0 font-medium">
              {s.label}: {s.value}
            </span>
            <input
              type="range"
              min={-5}
              max={5}
              step={1}
              value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[var(--color-primary)]"
              aria-label={s.label}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-surface"
          role="img"
          aria-label={`Duas retas: y=${m1}x+${b1} e y=${m2}x+${b2}. ${statusText}`}
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="var(--color-muted)" strokeWidth={1.5} />

          <path d={line1Path} fill="none" stroke="#2a78d6" strokeWidth={2.5} />
          <path d={line2Path} fill="none" stroke="#1baf7a" strokeWidth={2.5} />

          {intersectionX !== null &&
            Math.abs(intersectionX) <= RANGE &&
            Math.abs(intersectionY!) <= RANGE && (
              <circle cx={toPx(intersectionX)} cy={toPy(intersectionY!)} r={5} fill="#e34948" />
            )}
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste até que as duas retas sejam paralelas (mesma inclinação m, interceptos b diferentes)."
        isMet={parallel && !coincident}
      />
    </div>
  );
}

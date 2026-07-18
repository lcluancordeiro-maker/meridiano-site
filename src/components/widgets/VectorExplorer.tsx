"use client";

import { useState } from "react";
import { RANGE, SIZE, TICKS, formatNumber, toPx, toPy } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

export default function VectorExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);
  const [d, setD] = useState(1);

  const moduloU = Math.sqrt(a * a + b * b);
  const moduloV = Math.sqrt(c * c + d * d);
  const dot = a * c + b * d;
  const sumX = a + c;
  const sumY = b + d;

  const sliders = [
    { key: "a", label: "u: a", value: a, setValue: setA },
    { key: "b", label: "u: b", value: b, setValue: setB },
    { key: "c", label: "v: c", value: c, setValue: setC },
    { key: "d", label: "v: d", value: d, setValue: setD },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        u=({a},{b}) · v=({c},{d})
      </p>
      <p className="mt-1 text-sm text-muted">
        |u|={formatNumber(moduloU)} · |v|={formatNumber(moduloV)} · u·v={formatNumber(dot)}
        {dot === 0 ? " (perpendiculares!)" : ""}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-2 text-sm text-foreground">
            <span className="w-16 shrink-0 font-medium">
              {s.label}: {s.value}
            </span>
            <input
              type="range"
              min={-5}
              max={5}
              step={1}
              value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
              aria-label={`Componente ${s.label}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-white"
          role="img"
          aria-label={`Vetores u=(${a},${b}) e v=(${c},${d}), com soma (${sumX},${sumY})`}
        >
          {TICKS.map((v) => (
            <line key={`gx${v}`} x1={toPx(v)} x2={toPx(v)} y1={0} y2={SIZE} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          {TICKS.map((v) => (
            <line key={`gy${v}`} x1={0} x2={SIZE} y1={toPy(v)} y2={toPy(v)} stroke="#e4e2f1" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="#898781" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="#898781" strokeWidth={1.5} />

          <line
            x1={toPx(0)}
            y1={toPy(0)}
            x2={toPx(Math.max(-RANGE, Math.min(RANGE, sumX)))}
            y2={toPy(Math.max(-RANGE, Math.min(RANGE, sumY)))}
            stroke="#8a63d2"
            strokeWidth={2}
            strokeDasharray="5,4"
          />
          <line x1={toPx(0)} y1={toPy(0)} x2={toPx(a)} y2={toPy(b)} stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toPx(a)} cy={toPy(b)} r={5} fill="#2a78d6" />
          <text x={toPx(a) + 8} y={toPy(b) - 6} fontSize={13} fontWeight={600} fill="#2a78d6">
            u
          </text>

          <line x1={toPx(0)} y1={toPy(0)} x2={toPx(c)} y2={toPy(d)} stroke="#1baf7a" strokeWidth={2.5} />
          <circle cx={toPx(c)} cy={toPy(d)} r={5} fill="#1baf7a" />
          <text x={toPx(c) + 8} y={toPy(d) - 6} fontSize={13} fontWeight={600} fill="#1baf7a">
            v
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste u e v até que sejam perpendiculares (produto escalar u·v = 0), sem que nenhum seja o vetor nulo."
        isMet={dot === 0 && (a !== 0 || b !== 0) && (c !== 0 || d !== 0)}
      />
    </div>
  );
}

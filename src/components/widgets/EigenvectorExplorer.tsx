"use client";

import { useState } from "react";
import { RANGE, SIZE, TICKS, formatNumber, toPx, toPy } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

export default function EigenvectorExplorer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(1);

  const avx = a * vx + b * vy;
  const avy = c * vx + d * vy;
  const cross = vx * avy - vy * avx;
  const isZeroVector = vx === 0 && vy === 0;
  const isZeroAv = avx === 0 && avy === 0;
  const isEigenvector = !isZeroVector && !isZeroAv && cross === 0;
  const eigenvalue = isEigenvector ? (vx !== 0 ? avx / vx : avy / vy) : null;

  const matrixSliders = [
    { key: "a", label: "a", value: a, setValue: setA },
    { key: "b", label: "b", value: b, setValue: setB },
    { key: "c", label: "c", value: c, setValue: setC },
    { key: "d", label: "d", value: d, setValue: setD },
  ];
  const vectorSliders = [
    { key: "vx", label: "v: x", value: vx, setValue: setVx },
    { key: "vy", label: "v: y", value: vy, setValue: setVy },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        A = [[{a}, {b}], [{c}, {d}]] · v = ({vx}, {vy}) · Av = ({avx}, {avy})
      </p>
      <p className="mt-1 text-sm text-muted">
        {isEigenvector
          ? `v é autovetor de A! Autovalor λ = ${formatNumber(eigenvalue!)}.`
          : "Av não está na mesma direção de v — v não é autovetor."}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Matriz A</p>
          {matrixSliders.map((s) => (
            <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
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
                className="min-w-0 flex-1 accent-[var(--color-primary)]"
                aria-label={`Elemento ${s.label} da matriz`}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Vetor v</p>
          {vectorSliders.map((s) => (
            <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
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
                className="min-w-0 flex-1 accent-[var(--color-primary)]"
                aria-label={`Componente ${s.label}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full bg-surface"
          role="img"
          aria-label={`Vetor v=(${vx},${vy}) e sua transformação Av=(${avx},${avy}) pela matriz A`}
        >
          {TICKS.map((t) => (
            <line key={`gx${t}`} x1={toPx(t)} x2={toPx(t)} y1={0} y2={SIZE} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          {TICKS.map((t) => (
            <line key={`gy${t}`} x1={0} x2={SIZE} y1={toPy(t)} y2={toPy(t)} stroke="var(--color-border)" strokeWidth={1} />
          ))}
          <line x1={0} x2={SIZE} y1={toPy(0)} y2={toPy(0)} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={toPx(0)} x2={toPx(0)} y1={0} y2={SIZE} stroke="var(--color-muted)" strokeWidth={1.5} />

          <line
            x1={toPx(0)}
            y1={toPy(0)}
            x2={toPx(Math.max(-RANGE, Math.min(RANGE, avx)))}
            y2={toPy(Math.max(-RANGE, Math.min(RANGE, avy)))}
            stroke="#e34948"
            strokeWidth={2.5}
          />
          <circle cx={toPx(Math.max(-RANGE, Math.min(RANGE, avx)))} cy={toPy(Math.max(-RANGE, Math.min(RANGE, avy)))} r={5} fill="#e34948" />
          <text
            x={toPx(Math.max(-RANGE, Math.min(RANGE, avx))) + 8}
            y={toPy(Math.max(-RANGE, Math.min(RANGE, avy))) - 6}
            fontSize={13}
            fontWeight={600}
            fill="#e34948"
          >
            Av
          </text>

          <line x1={toPx(0)} y1={toPy(0)} x2={toPx(vx)} y2={toPy(vy)} stroke="#2a78d6" strokeWidth={2.5} />
          <circle cx={toPx(vx)} cy={toPy(vy)} r={5} fill="#2a78d6" />
          <text x={toPx(vx) + 8} y={toPy(vy) - 6} fontSize={13} fontWeight={600} fill="#2a78d6">
            v
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Ajuste até que Av aponte exatamente na mesma direção de v, tornando v um autovetor (dica: A=[[3,0],[0,1]], v=(1,0))."
        isMet={isEigenvector}
      />
    </div>
  );
}

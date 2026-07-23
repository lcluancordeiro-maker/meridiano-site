"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

function MatrixGrid({
  label,
  values,
  ariaLabel,
}: {
  label: string;
  values: [number, number, number, number];
  ariaLabel: string;
}) {
  return (
    <div>
      <p className="text-center text-sm font-medium text-muted">{label}</p>
      <div
        className="mt-1 grid w-fit grid-cols-2 gap-1.5"
        role="img"
        aria-label={ariaLabel}
      >
        {values.map((v, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-background px-3 py-2 text-center font-display text-base font-semibold text-foreground"
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatrixOperationsExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);
  const [k, setK] = useState(2);

  const sliders = [
    { key: "a", label: "a", value: a, setValue: setA, min: -5, max: 5 },
    { key: "b", label: "b", value: b, setValue: setB, min: -5, max: 5 },
    { key: "c", label: "c", value: c, setValue: setC, min: -5, max: 5 },
    { key: "d", label: "d", value: d, setValue: setD, min: -5, max: 5 },
    { key: "k", label: "escalar k", value: k, setValue: setK, min: -3, max: 5 },
  ];

  const kA: [number, number, number, number] = [k * a, k * b, k * c, k * d];
  const at: [number, number, number, number] = [a, c, b, d];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        A = [[{a}, {b}], [{c}, {d}]] · k = {k}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-28 shrink-0 font-medium">
              {s.label}: {s.value}
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={1}
              value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[var(--color-primary)]"
              aria-label={`Valor de ${s.label}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-6">
        <MatrixGrid
          label="A"
          values={[a, b, c, d]}
          ariaLabel={`Matriz A = [[${a}, ${b}], [${c}, ${d}]]`}
        />
        <MatrixGrid
          label={`k × A`}
          values={kA}
          ariaLabel={`Matriz k vezes A, com k igual a ${k}, resultando em [[${kA[0]}, ${kA[1]}], [${kA[2]}, ${kA[3]}]]`}
        />
        <MatrixGrid
          label="Aᵀ (transposta)"
          values={at}
          ariaLabel={`Matriz transposta de A, resultando em [[${at[0]}, ${at[1]}], [${at[2]}, ${at[3]}]]`}
        />
      </div>

      <WidgetChallenge
        goal="Ajuste os sliders até que a diagonal principal de k×A (elementos (1,1) e (2,2)) sejam ambos iguais a 12 (dica: a=6, d=6, k=2)."
        isMet={kA[0] === 12 && kA[3] === 12}
      />
    </div>
  );
}

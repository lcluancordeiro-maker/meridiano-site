"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

export default function MatrixExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);

  const determinant = a * d - b * c;

  const sliders = [
    { key: "a", label: "a", value: a, setValue: setA },
    { key: "b", label: "b", value: b, setValue: setB },
    { key: "c", label: "c", value: c, setValue: setC },
    { key: "d", label: "d", value: d, setValue: setD },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        det(A) = {a}×{d} − {b}×{c} = {determinant}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-3 text-sm text-foreground">
            <span className="w-24 shrink-0 font-medium">
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
              aria-label={`Elemento ${s.label} da matriz`}
            />
          </label>
        ))}
      </div>

      <div
        className="mt-4 grid w-fit grid-cols-2 gap-2"
        role="img"
        aria-label={`Matriz A = [[${a}, ${b}], [${c}, ${d}]], determinante ${determinant}`}
      >
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-center font-display text-lg font-semibold text-foreground">
          {a}
        </div>
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-center font-display text-lg font-semibold text-foreground">
          {b}
        </div>
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-center font-display text-lg font-semibold text-foreground">
          {c}
        </div>
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-center font-display text-lg font-semibold text-foreground">
          {d}
        </div>
      </div>

      <WidgetChallenge
        goal="Ajuste os sliders até que det(A) seja igual a 10."
        isMet={determinant === 10}
      />
    </div>
  );
}

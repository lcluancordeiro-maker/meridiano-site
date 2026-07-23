"use client";

import { useState } from "react";

const b0 = 10;

export default function MultipleRegressionExplorer() {
  const [b1, setB1] = useState(2);
  const [b2, setB2] = useState(3);
  const [x1, setX1] = useState(5);
  const [x2, setX2] = useState(4);

  const y = b0 + b1 * x1 + b2 * x2;
  const yWithMoreX2 = b0 + b1 * x1 + b2 * (x2 + 1);
  const partialEffect = yWithMoreX2 - y;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Y = {b0} + {b1}×{x1} + {b2}×{x2} = {y}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">β1: {b1}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={b1}
            onChange={(e) => setB1(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente β1"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">β2: {b2}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={b2}
            onChange={(e) => setB2(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Coeficiente β2"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">X1: {x1}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={x1}
            onChange={(e) => setX1(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Variável X1"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">X2: {x2}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={x2}
            onChange={(e) => setX2(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Variável X2"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4 text-sm">
        <p className="text-foreground">
          Y = β0 + β1X1 + β2X2 = {b0} + {b1}×{x1} + {b2}×{x2} = <strong>{y}</strong>
        </p>
        <p className="mt-2 text-primary">
          Aumentando X2 em 1 (mantendo X1={x1} fixo): Y = {b0} + {b1}×{x1} + {b2}×{x2 + 1} ={" "}
          <strong>{yWithMoreX2}</strong> — efeito parcial de β2 = +{partialEffect}.
        </p>
      </div>
      <p className="mt-2 text-xs text-foreground">
        β2 é o efeito de X2 sobre Y &quot;tudo mais constante&quot; — repare que o efeito parcial (+{partialEffect}) é
        sempre igual a β2, não importa o valor de X1.
      </p>
    </div>
  );
}

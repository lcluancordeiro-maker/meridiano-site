"use client";

import { useState } from "react";

type Operator = "E" | "OU";

export default function LogicOperatorExplorer() {
  const [x, setX] = useState(5);
  const [operator, setOperator] = useState<Operator>("E");

  const conditionA = x > 3;
  const conditionB = x < 10;
  const result = operator === "E" ? conditionA && conditionB : conditionA || conditionB;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        (x &gt; 3) {operator} (x &lt; 10) = {result ? "Verdadeiro" : "Falso"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">x: {x}</span>
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor de x"
          />
        </label>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">Operador:</span>
          <div className="flex gap-2">
            {(["E", "OU"] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperator(op)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  operator === op
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-foreground hover:bg-background"
                }`}
                aria-pressed={operator === op}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-center gap-4 text-sm">
          <span
            className={`rounded-lg px-3 py-2 font-semibold ${
              conditionA ? "bg-success-bg text-success" : "bg-error-bg text-error"
            }`}
          >
            x &gt; 3: {conditionA ? "V" : "F"}
          </span>
          <span className="font-display text-base font-bold text-foreground">{operator}</span>
          <span
            className={`rounded-lg px-3 py-2 font-semibold ${
              conditionB ? "bg-success-bg text-success" : "bg-error-bg text-error"
            }`}
          >
            x &lt; 10: {conditionB ? "V" : "F"}
          </span>
          <span className="font-display text-base font-bold text-foreground">=</span>
          <span
            className={`rounded-lg px-3 py-2 font-semibold ${
              result ? "bg-success-bg text-success" : "bg-error-bg text-error"
            }`}
          >
            {result ? "V" : "F"}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground">
        {operator === "E"
          ? "E só é verdadeiro quando as duas condições são verdadeiras ao mesmo tempo."
          : "OU é verdadeiro quando pelo menos uma das duas condições é verdadeira."}
      </p>
    </div>
  );
}

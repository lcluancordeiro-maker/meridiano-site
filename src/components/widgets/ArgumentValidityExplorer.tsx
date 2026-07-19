"use client";

import { useState } from "react";

const RULES = [
  { name: "Modus Ponens", premises: ["p → q", "p"], conclusion: "q", valid: true },
  { name: "Modus Tollens", premises: ["p → q", "~q"], conclusion: "~p", valid: true },
  { name: "Silogismo Hipotético", premises: ["p → q", "q → r"], conclusion: "p → r", valid: true },
  { name: "Afirmar o Consequente", premises: ["p → q", "q"], conclusion: "p", valid: false },
  { name: "Negar o Antecedente", premises: ["p → q", "~p"], conclusion: "~q", valid: false },
];

export default function ArgumentValidityExplorer() {
  const [index, setIndex] = useState(0);
  const rule = RULES[index];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {rule.name}: {rule.premises.join(", ")} ⊢ {rule.conclusion}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {RULES.map((r, i) => (
          <button
            key={r.name}
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            aria-label={`Regra: ${r.name}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === index
                ? "bg-primary text-white"
                : "border border-border bg-surface text-foreground hover:bg-background"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-1 font-mono text-sm text-foreground">
          {rule.premises.map((p, i) => (
            <p key={i}>
              Premissa {i + 1}: {p}
            </p>
          ))}
          <p className="mt-1 border-t border-border pt-1">Conclusão: {rule.conclusion}</p>
        </div>
        <p
          className={`mt-3 inline-block rounded-lg border px-3 py-1 text-sm font-semibold ${
            rule.valid ? "border-success bg-success-bg text-success" : "border-error bg-error-bg text-error"
          }`}
        >
          {rule.valid ? "Válido" : "Inválido (falácia)"}
        </p>
      </div>
      <p className="mt-2 text-xs text-foreground">
        {rule.valid
          ? "A conclusão decorre necessariamente das premissas, qualquer que seja o significado de p, q e r."
          : "Existem casos em que as premissas são verdadeiras, mas a conclusão é falsa — por isso o argumento não é válido."}
      </p>
    </div>
  );
}

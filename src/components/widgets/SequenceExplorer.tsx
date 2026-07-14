"use client";

import { useState } from "react";
import { formatNumber } from "./svgUtils";

const TERMS_COUNT = 6;

export default function SequenceExplorer() {
  const [mode, setMode] = useState<"pa" | "pg">("pa");
  const [firstTerm, setFirstTerm] = useState(2);
  const [ratio, setRatio] = useState(3);

  function selectMode(next: "pa" | "pg") {
    setMode(next);
    setRatio(next === "pa" ? 3 : 2);
  }

  const terms = Array.from({ length: TERMS_COUNT }, (_, i) => {
    const n = i + 1;
    return mode === "pa" ? firstTerm + (n - 1) * ratio : firstTerm * Math.pow(ratio, n - 1);
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex gap-2">
        <button
          onClick={() => selectMode("pa")}
          aria-label="Mostrar progressão aritmética (PA)"
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            mode === "pa" ? "bg-primary text-white" : "border border-border text-foreground"
          }`}
        >
          PA
        </button>
        <button
          onClick={() => selectMode("pg")}
          aria-label="Mostrar progressão geométrica (PG)"
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            mode === "pg" ? "bg-primary text-white" : "border border-border text-foreground"
          }`}
        >
          PG
        </button>
      </div>

      <p className="mt-3 font-display text-base font-semibold text-foreground">
        {mode === "pa" ? `an = ${firstTerm} + (n-1)×${ratio}` : `an = ${firstTerm} × ${ratio}^(n-1)`}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">1º termo (a1): {firstTerm}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={firstTerm}
            onChange={(e) => setFirstTerm(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">{mode === "pa" ? "Razão (r)" : "Razão (q)"}: {ratio}</span>
          <input
            type="range"
            min={mode === "pa" ? -5 : 2}
            max={mode === "pa" ? 5 : 4}
            step={1}
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="img"
        aria-label={`Termos da sequência: ${terms.map(formatNumber).join(", ")}`}
      >
        {terms.map((term, i) => (
          <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background px-3 py-2">
            <span className="text-xs text-muted">a{i + 1}</span>
            <span className="font-display text-sm font-semibold text-foreground">{formatNumber(term)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

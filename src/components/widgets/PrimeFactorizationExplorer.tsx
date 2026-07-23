"use client";

import { useMemo, useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

function factorize(n: number): { prime: number; exponent: number }[] {
  const factors: { prime: number; exponent: number }[] = [];
  let remaining = n;
  for (let p = 2; p * p <= remaining; p++) {
    let exponent = 0;
    while (remaining % p === 0) {
      remaining /= p;
      exponent++;
    }
    if (exponent > 0) factors.push({ prime: p, exponent });
  }
  if (remaining > 1) factors.push({ prime: remaining, exponent: 1 });
  return factors;
}

function superscript(exponent: number): string {
  const digits: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  };
  return exponent
    .toString()
    .split("")
    .map((d) => digits[d])
    .join("");
}

export default function PrimeFactorizationExplorer() {
  const [n, setN] = useState(60);

  const factors = useMemo(() => factorize(n), [n]);
  const divisorCount = factors.reduce((acc, f) => acc * (f.exponent + 1), 1);
  const expression = factors
    .map((f) => (f.exponent > 1 ? `${f.prime}${superscript(f.exponent)}` : `${f.prime}`))
    .join(" × ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {n} = {expression}
      </p>
      <p className="mt-1 text-sm text-muted">
        {factors.length} fator{factors.length === 1 ? "" : "es"} primo{factors.length === 1 ? "" : "s"} distinto
        {factors.length === 1 ? "" : "s"} · {divisorCount} divisores positivos
      </p>

      <label className="mt-4 flex items-center gap-3 text-sm text-foreground">
        <span className="w-24 shrink-0 font-medium">n: {n}</span>
        <input
          type="range"
          min={2}
          max={100}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="min-w-0 flex-1 accent-[var(--color-primary)]"
          aria-label="Número n"
        />
      </label>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="img"
        aria-label={`Fatoração de ${n}: ${expression}`}
      >
        {factors.map((f) => (
          <div
            key={f.prime}
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background px-3 py-2"
          >
            <span className="text-xs text-muted">primo</span>
            <span className="font-display text-sm font-semibold text-foreground">
              {f.prime}{f.exponent > 1 ? superscript(f.exponent) : ""}
            </span>
          </div>
        ))}
      </div>

      <WidgetChallenge
        goal="Encontre um número entre 2 e 100 que tenha exatamente 3 fatores primos distintos (ex: 2×3×5)."
        isMet={factors.length === 3}
      />
    </div>
  );
}

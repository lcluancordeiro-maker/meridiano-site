"use client";

import { useState } from "react";
import { clamp } from "./svgUtils";
import WidgetChallenge from "./WidgetChallenge";

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return Math.round(factorial(n) / (factorial(k) * factorial(n - k)));
}

const MAX_N = 10;

export default function CombinationExplorer() {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);

  function updateN(nextN: number) {
    setN(nextN);
    setK((prevK) => clamp(prevK, 0, nextN));
  }

  const row = Array.from({ length: n + 1 }, (_, i) => combinations(n, i));
  const result = combinations(n, k);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        C({n}, {k}) = {n}!/({k}!×{n - k}!) = {result}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">n: {n}</span>
          <input
            type="range"
            min={1}
            max={MAX_N}
            step={1}
            value={n}
            onChange={(e) => updateN(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="Total de elementos (n)"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">k: {k}</span>
          <input
            type="range"
            min={0}
            max={n}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="Elementos escolhidos (k)"
          />
        </label>
      </div>

      <div
        className="mt-4 flex flex-wrap justify-center gap-1.5"
        role="img"
        aria-label={`Linha ${n} do triângulo de Pascal, com C(${n},${k}) = ${result} destacado`}
      >
        {row.map((value, i) => (
          <div
            key={i}
            className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 font-display text-sm font-semibold ${
              i === k
                ? "border-primary bg-primary text-white"
                : "border-border bg-background text-foreground"
            }`}
          >
            {value}
          </div>
        ))}
      </div>

      <WidgetChallenge
        goal="Encontre valores de n e k tais que C(n,k) = 10."
        isMet={result === 10}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

export default function LoopStepExplorer() {
  const [n, setN] = useState(5);

  const steps = useMemo(() => {
    let running = 0;
    const list: { i: number; soma: number }[] = [];
    for (let i = 1; i <= n; i++) {
      running += i;
      list.push({ i, soma: running });
    }
    return list;
  }, [n]);

  const total = steps.length > 0 ? steps[steps.length - 1].soma : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        para i de 1 até {n}: soma ← soma + i → soma = {total}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">n: {n}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Limite superior do laço, n"
          />
        </label>
      </div>

      <div className="mt-4 max-h-40 overflow-y-auto rounded-xl border border-border bg-white p-3 font-mono text-sm">
        {steps.map(({ i, soma }) => (
          <p key={i} className="text-foreground">
            i={i} → soma={soma}
          </p>
        ))}
      </div>
      <p className="mt-2 text-xs text-foreground">
        Cada linha é uma repetição do laço — soma acumula 1+2+...+{n} = {total}.
      </p>
    </div>
  );
}

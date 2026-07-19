"use client";

import { useMemo, useState } from "react";

export default function RecursionExplorer() {
  const [n, setN] = useState(4);

  const calls = useMemo(() => {
    const list: { n: number }[] = [];
    for (let i = n; i >= 1; i--) list.push({ n: i });
    return list;
  }, [n]);

  const factorial = useMemo(() => {
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }, [n]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">fatorial({n}) = {factorial}</p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">n: {n}</span>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Valor de n"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white p-3 font-mono text-xs">
        {calls.map(({ n: k }, i) => (
          <p key={k} style={{ paddingLeft: `${i * 12}px` }} className="text-foreground">
            fatorial({k}) {k > 1 ? `= ${k} × fatorial(${k - 1})` : "= 1 (caso base)"}
          </p>
        ))}
      </div>
      <p className="mt-2 text-xs text-foreground">
        As chamadas empilham até o caso base (n=1), depois desempilham multiplicando de trás para frente:
        resultado final {factorial}.
      </p>
    </div>
  );
}

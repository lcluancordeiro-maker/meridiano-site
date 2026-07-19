"use client";

import { useState } from "react";

export default function FunctionCallExplorer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  const somaResult = a + b;
  const dobroResult = somaResult * 2;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        soma({a}, {b}) = {somaResult} · dobro(soma({a}, {b})) = {dobroResult}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">a: {a}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Parâmetro a"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-16 shrink-0 font-medium">b: {b}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Parâmetro b"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white p-4 font-mono text-sm">
        <p className="text-foreground">função soma(a, b): retorna a + b</p>
        <p className="text-foreground">função dobro(x): retorna x * 2</p>
        <p className="mt-2 text-primary">
          soma({a}, {b}) → {a} + {b} = {somaResult}
        </p>
        <p className="text-primary">
          dobro({somaResult}) → {somaResult} * 2 = {dobroResult}
        </p>
      </div>
      <p className="mt-2 text-xs text-foreground">
        Uma função pode chamar outra: dobro(soma(a, b)) primeiro calcula soma, depois usa o resultado como
        entrada de dobro.
      </p>
    </div>
  );
}

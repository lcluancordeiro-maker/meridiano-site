"use client";

import { useState } from "react";

export default function ConditionalLogicExplorer() {
  const [x, setX] = useState(8);
  const threshold = 5;

  const condition = x > threshold;
  const y = condition ? 1 : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        x = {x} → (x &gt; {threshold}) é {condition ? "Verdadeiro" : "Falso"} → y = {y}
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
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4 font-mono text-sm">
        <p className="text-foreground">x ← {x}</p>
        <p className="text-foreground">
          se x &gt; {threshold} então
        </p>
        <p className={`pl-4 ${condition ? "font-bold text-primary" : "text-muted"}`}>y ← 1</p>
        <p className="text-foreground">senão</p>
        <p className={`pl-4 ${!condition ? "font-bold text-primary" : "text-muted"}`}>y ← 0</p>
      </div>
      <p className="mt-2 text-xs text-foreground">
        O ramo destacado é o que executa — só um dos dois blocos roda em cada passagem pelo &quot;se/senão&quot;.
      </p>
    </div>
  );
}

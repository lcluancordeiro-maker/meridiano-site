"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

export default function MultiplicationArrayExplorer() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const product = rows * cols;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {rows} × {cols} = {product}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Fileiras: {rows}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de fileiras"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-24 shrink-0 font-medium">Colunas: {cols}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de colunas"
          />
        </label>
      </div>

      <div
        className="mt-4 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Grade de ${rows} fileiras por ${cols} colunas, totalizando ${product}`}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-primary" />
        ))}
      </div>

      <WidgetChallenge
        goal="Monte uma grade que mostre 6 × 7."
        isMet={(rows === 6 && cols === 7) || (rows === 7 && cols === 6)}
      />
    </div>
  );
}

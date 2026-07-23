"use client";

import { useState } from "react";

export default function EulerFormulaExplorer() {
  const [vertices, setVertices] = useState(8);
  const [edges, setEdges] = useState(12);
  const [faces, setFaces] = useState(6);

  const result = vertices - edges + faces;
  const isValid = result === 2;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        V − A + F = {vertices} − {edges} + {faces} = {result}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Vértices (V): {vertices}</span>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={vertices}
            onChange={(e) => setVertices(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de vértices"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Arestas (A): {edges}</span>
          <input
            type="range"
            min={6}
            max={30}
            step={1}
            value={edges}
            onChange={(e) => setEdges(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de arestas"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Faces (F): {faces}</span>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={faces}
            onChange={(e) => setFaces(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Número de faces"
          />
        </label>
      </div>

      <div
        className={`mt-4 rounded-xl border p-4 text-center text-sm font-semibold ${
          isValid ? "border-success bg-success-bg text-success" : "border-error bg-error-bg text-error"
        }`}
      >
        {isValid
          ? "V − A + F = 2 — poliedro convexo válido!"
          : `V − A + F = ${result} ≠ 2 — essa combinação não forma um poliedro convexo.`}
      </div>
      <p className="mt-2 text-xs text-foreground">
        Um cubo (V=8, A=12, F=6) satisfaz a relação: 8 − 12 + 6 = 2.
      </p>
    </div>
  );
}

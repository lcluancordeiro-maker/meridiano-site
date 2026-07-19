"use client";

import { useState } from "react";

export default function ObjectStateExplorer() {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        c1.valor = {c1} · c2.valor = {c2}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-white p-4 text-center">
          <p className="text-sm font-semibold text-foreground">c1 (Contador)</p>
          <p className="mt-2 font-display text-2xl font-bold text-primary">{c1}</p>
          <button
            onClick={() => setC1((v) => v + 1)}
            className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            c1.incrementar()
          </button>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 text-center">
          <p className="text-sm font-semibold text-foreground">c2 (Contador)</p>
          <p className="mt-2 font-display text-2xl font-bold text-primary">{c2}</p>
          <button
            onClick={() => setC2((v) => v + 1)}
            className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            c2.incrementar()
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-foreground">
        c1 e c2 são duas instâncias independentes da mesma classe Contador — incrementar uma não afeta a
        outra, porque cada objeto tem seu próprio valor.
      </p>
    </div>
  );
}

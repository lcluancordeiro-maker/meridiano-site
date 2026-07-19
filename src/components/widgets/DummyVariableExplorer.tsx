"use client";

import { useState } from "react";

const B0 = 1000;
const B1 = 200;
const B2 = 500;

export default function DummyVariableExplorer() {
  const [anos, setAnos] = useState(5);
  const [urbano, setUrbano] = useState(false);

  const dummy = urbano ? 1 : 0;
  const salario = B0 + B1 * anos + B2 * dummy;
  const salarioOutraRegiao = B0 + B1 * anos + B2 * (urbano ? 0 : 1);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        salário = {B0} + {B1}×{anos} + {B2}×{dummy} = {salario}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Anos de educação: {anos}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={anos}
            onChange={(e) => setAnos(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Anos de educação"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm text-foreground">
          <span className="font-medium">Área urbana (dummy=1)?</span>
          <button
            onClick={() => setUrbano((v) => !v)}
            aria-pressed={urbano}
            aria-label="Área urbana"
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              urbano ? "bg-primary text-white" : "border border-border bg-surface text-foreground hover:bg-background"
            }`}
          >
            {urbano ? "Sim" : "Não"}
          </button>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface p-4 text-sm">
        <p className="text-foreground">
          salário = β0 + β1·anos + β2·urbano = {B0} + {B1}×{anos} + {B2}×{dummy} = <strong>{salario}</strong>
        </p>
        <p className="mt-2 text-primary">
          Trocando a dummy para {urbano ? "0 (rural)" : "1 (urbano)"}, mantendo anos={anos}: salário ={" "}
          <strong>{salarioOutraRegiao}</strong> — diferença de exatamente β2 = {B2}.
        </p>
      </div>
      <p className="mt-2 text-xs text-foreground">
        A dummy desloca o intercepto por β2 = {B2}, sem mudar a inclinação β1 = {B1} em relação aos anos de
        educação — as duas retas (urbana e rural) são paralelas.
      </p>
    </div>
  );
}

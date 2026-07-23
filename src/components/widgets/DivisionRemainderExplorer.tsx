"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

export default function DivisionRemainderExplorer() {
  const [dividend, setDividend] = useState(29);
  const [divisor, setDivisor] = useState(6);

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const groups = Array.from({ length: quotient }, (_, g) =>
    Array.from({ length: divisor }, (_, i) => g * divisor + i)
  );
  const remainderDots = Array.from({ length: remainder }, (_, i) => quotient * divisor + i);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {dividend} ÷ {divisor} = {quotient}
        {remainder > 0 ? `, resto ${remainder}` : ""}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Dividendo: {dividend}</span>
          <input
            type="range"
            min={1}
            max={99}
            step={1}
            value={dividend}
            onChange={(e) => setDividend(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Dividendo"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-28 shrink-0 font-medium">Divisor: {divisor}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={divisor}
            onChange={(e) => setDivisor(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Divisor"
          />
        </label>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-3"
        role="img"
        aria-label={`${dividend} repartidos em grupos de ${divisor}: ${quotient} grupos completos${
          remainder > 0 ? ` e resto ${remainder}` : ""
        }`}
      >
        {groups.map((group, g) => (
          <div key={g} className="flex gap-1 rounded-md border border-primary/40 p-1">
            {group.map((i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-primary" />
            ))}
          </div>
        ))}
        {remainder > 0 && (
          <div className="flex gap-1 rounded-md border border-dashed border-accent/60 p-1">
            {remainderDots.map((i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-accent" />
            ))}
          </div>
        )}
      </div>

      <WidgetChallenge
        goal="Ajuste o dividendo e o divisor para uma divisão com resto exatamente 5."
        isMet={remainder === 5}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const PLACE_NAMES = ["Unidades", "Dezenas", "Centenas", "Milhares"];

function digitsOf(n: number): number[] {
  return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10, Math.floor(n / 1000) % 10];
}

export default function ColumnAdditionExplorer() {
  const [a, setA] = useState(2847);
  const [b, setB] = useState(1968);

  const da = digitsOf(a);
  const db = digitsOf(b);
  const { steps } = PLACE_NAMES.reduce<{ carry: number; steps: string[] }>(
    (acc, name, i) => {
      const sum = da[i] + db[i] + acc.carry;
      const writeDigit = sum % 10;
      const carryOut = Math.floor(sum / 10);
      const text = `${name}: ${da[i]}+${db[i]}${acc.carry > 0 ? `+${acc.carry}` : ""}=${sum}${
        carryOut > 0 ? ` (escreve ${writeDigit}, leva ${carryOut})` : ` (escreve ${writeDigit})`
      }`;
      return { carry: carryOut, steps: [...acc.steps, text] };
    },
    { carry: 0, steps: [] }
  );
  const total = a + b;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {a} + {b} = {total}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Primeiro número: {a}</span>
          <input
            type="range"
            min={0}
            max={4999}
            step={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Primeiro número da soma"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Segundo número: {b}</span>
          <input
            type="range"
            min={0}
            max={4999}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Segundo número da soma"
          />
        </label>
      </div>

      <ul className="mt-4 flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 text-sm text-foreground">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <WidgetChallenge
        goal="Ajuste os dois números para que a soma seja exatamente 5.000."
        isMet={total === 5000}
      />
    </div>
  );
}

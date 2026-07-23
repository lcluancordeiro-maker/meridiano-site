"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

export default function EquivalentFractionsExplorer() {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(2);
  const [multiplier, setMultiplier] = useState(2);

  const clampedNumerator = Math.min(numerator, denominator);
  const equivNumerator = clampedNumerator * multiplier;
  const equivDenominator = denominator * multiplier;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {clampedNumerator}/{denominator} = {equivNumerator}/{equivDenominator}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Numerador: {clampedNumerator}</span>
          <input
            type="range"
            min={0}
            max={denominator}
            step={1}
            value={clampedNumerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Numerador da fração original"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Denominador: {denominator}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Denominador da fração original"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Multiplicar por: {multiplier}</span>
          <input
            type="range"
            min={2}
            max={4}
            step={1}
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Fator de multiplicação"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div
          className="flex gap-1"
          role="img"
          aria-label={`Fração original: ${clampedNumerator} de ${denominator} partes preenchidas`}
        >
          {Array.from({ length: denominator }, (_, i) => i < clampedNumerator).map((filled, i) => (
            <div
              key={i}
              className={`h-10 flex-1 rounded-md border-2 ${
                filled ? "border-primary bg-primary" : "border-border bg-background"
              }`}
            />
          ))}
        </div>
        <div
          className="flex gap-1"
          role="img"
          aria-label={`Fração equivalente: ${equivNumerator} de ${equivDenominator} partes preenchidas`}
        >
          {Array.from({ length: equivDenominator }, (_, i) => i < equivNumerator).map((filled, i) => (
            <div
              key={i}
              className={`h-10 flex-1 rounded-md border-2 ${
                filled ? "border-accent bg-accent" : "border-border bg-background"
              }`}
            />
          ))}
        </div>
      </div>

      <WidgetChallenge goal="Mostre que 1/3 é equivalente a 4/12." isMet={clampedNumerator === 1 && denominator === 3 && multiplier === 4} />
    </div>
  );
}

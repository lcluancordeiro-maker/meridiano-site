"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function FractionVisualizer() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  const clampedNumerator = Math.min(numerator, denominator);
  const divisor = clampedNumerator === 0 ? 1 : gcd(clampedNumerator, denominator);
  const simplifiedNumerator = clampedNumerator / divisor;
  const simplifiedDenominator = denominator / divisor;
  const isAlreadySimplified = divisor === 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        {clampedNumerator}/{denominator}
        {!isAlreadySimplified && (
          <span className="ml-2 text-sm font-normal text-muted">
            = {simplifiedNumerator}/{simplifiedDenominator} simplificada
          </span>
        )}
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
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-32 shrink-0 font-medium">Denominador: {denominator}</span>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div
        className="mt-4 flex gap-1"
        role="img"
        aria-label={`Representação visual de ${clampedNumerator} de ${denominator} partes preenchidas`}
      >
        {Array.from({ length: denominator }, (_, i) => i < clampedNumerator).map((filled, i) => (
          <div
            key={i}
            className={`h-16 flex-1 rounded-md border-2 ${
              filled ? "border-primary bg-primary" : "border-border bg-background"
            }`}
          />
        ))}
      </div>

      <WidgetChallenge
        goal="Mostre uma fração equivalente a 1/2 usando denominador 8."
        isMet={denominator === 8 && clampedNumerator === 4}
      />
    </div>
  );
}

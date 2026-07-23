"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

type PlaceKey = "milhares" | "centenas" | "dezenas" | "unidades";

const PLACES: { key: PlaceKey; singular: string; plural: string; multiplier: number; color: string }[] = [
  { key: "milhares", singular: "milhar", plural: "milhares", multiplier: 1000, color: "#4a3aa7" },
  { key: "centenas", singular: "centena", plural: "centenas", multiplier: 100, color: "#2a78d6" },
  { key: "dezenas", singular: "dezena", plural: "dezenas", multiplier: 10, color: "#1baf7a" },
  { key: "unidades", singular: "unidade", plural: "unidades", multiplier: 1, color: "#eda100" },
];

export default function PlaceValueExplorer() {
  const [digits, setDigits] = useState<Record<PlaceKey, number>>({
    milhares: 3,
    centenas: 4,
    dezenas: 2,
    unidades: 6,
  });

  const total = PLACES.reduce((sum, p) => sum + digits[p.key] * p.multiplier, 0);
  const expanded = PLACES.filter((p) => digits[p.key] > 0)
    .map((p) => digits[p.key] * p.multiplier)
    .join(" + ");

  function setDigit(key: PlaceKey, value: number) {
    setDigits((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-2xl font-semibold text-foreground">{total.toLocaleString("pt-BR")}</p>
      <p className="mt-1 text-sm text-muted">{expanded || "0"}</p>

      <div className="mt-4 flex flex-col gap-4">
        {PLACES.map((p) => (
          <div key={p.key}>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <span className="w-32 shrink-0 font-medium">
                {digits[p.key]} {digits[p.key] === 1 ? p.singular : p.plural}
              </span>
              <input
                type="range"
                min={0}
                max={9}
                step={1}
                value={digits[p.key]}
                onChange={(e) => setDigit(p.key, Number(e.target.value))}
                className="min-w-0 flex-1 accent-[var(--color-primary)]"
                aria-label={`Algarismo das ${p.plural}`}
              />
            </label>
            <div
              className="mt-1.5 flex gap-1"
              role="img"
              aria-label={`${digits[p.key]} ${digits[p.key] === 1 ? p.singular : p.plural} preenchidas`}
            >
              {Array.from({ length: 9 }, (_, i) => i < digits[p.key]).map((filled, i) => (
                <div
                  key={i}
                  className="h-3 flex-1 rounded-sm"
                  style={{ backgroundColor: filled ? p.color : "var(--color-border)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <WidgetChallenge goal="Monte o número 2.050 usando os sliders." isMet={total === 2050} />
    </div>
  );
}

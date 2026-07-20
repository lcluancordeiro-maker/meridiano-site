"use client";

import { useState } from "react";
import WidgetChallenge from "./WidgetChallenge";

const WIDTH = 320;
const HEIGHT = 200;
const MARGIN = 36;
const MAX_METERS = 15;

export default function RectanglePerimeterExplorer() {
  const [length, setLength] = useState(8);
  const [width, setWidth] = useState(5);
  const perimeter = 2 * (length + width);

  const availableWidth = WIDTH - 2 * MARGIN;
  const availableHeight = HEIGHT - 2 * MARGIN;
  const scale = Math.min(availableWidth, availableHeight) / MAX_METERS;
  const rectWidth = length * scale;
  const rectHeight = width * scale;
  const rectX = MARGIN + (availableWidth - rectWidth) / 2;
  const rectY = MARGIN + (availableHeight - rectHeight) / 2;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <p className="font-display text-base font-semibold text-foreground">
        Perímetro = 2 × ({length} + {width}) = {perimeter} m
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Comprimento: {length} m</span>
          <input
            type="range"
            min={1}
            max={MAX_METERS}
            step={1}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Comprimento do retângulo, em metros"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <span className="w-40 shrink-0 font-medium">Largura: {width} m</span>
          <input
            type="range"
            min={1}
            max={MAX_METERS}
            step={1}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-primary)]"
            aria-label="Largura do retângulo, em metros"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Retângulo de ${length} metros de comprimento por ${width} metros de largura, com perímetro ${perimeter} metros`}
        >
          <rect
            x={rectX}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
            fill="var(--color-primary)"
            fillOpacity={0.15}
            stroke="var(--color-primary)"
            strokeWidth={2}
          />
          <text
            x={rectX + rectWidth / 2}
            y={rectY - 10}
            fontSize={12}
            fill="var(--color-muted)"
            textAnchor="middle"
          >
            {length} m
          </text>
          <text
            x={rectX - 10}
            y={rectY + rectHeight / 2}
            fontSize={12}
            fill="var(--color-muted)"
            textAnchor="middle"
            transform={`rotate(-90, ${rectX - 10}, ${rectY + rectHeight / 2})`}
          >
            {width} m
          </text>
        </svg>
      </div>

      <WidgetChallenge
        goal="Monte um retângulo com perímetro igual a 20 metros."
        isMet={perimeter === 20}
      />
    </div>
  );
}

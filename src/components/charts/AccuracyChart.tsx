"use client";

import { useId, useState } from "react";

export type AccuracyDatum = {
  label: string;
  value: number | null; // percentage 0-100, null = not attempted yet
  color: string;
};

const W = 480;
const H = 220;
const PAD_TOP = 24;
const BAR_MAX_WIDTH = 24;

export default function AccuracyChart({ data }: { data: AccuracyDatum[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gid = useId();
  const manyBars = data.length > 5;
  const padBottom = manyBars ? 46 : 34;
  const plotHeight = H - padBottom - PAD_TOP;
  const bandWidth = W / data.length;
  const barWidth = Math.min(BAR_MAX_WIDTH, bandWidth * 0.55);

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div>
      <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label={`Percentual de acertos por tópico: ${data
            .map((d) => `${d.label} ${d.value ?? 0}%`)
            .join(", ")}`}
        >
          {gridLines.map((g) => {
            const y = PAD_TOP + plotHeight - (g / 100) * plotHeight;
            return (
              <line
                key={g}
                x1={0}
                x2={W}
                y1={y}
                y2={y}
                stroke="#e4e2f1"
                strokeWidth={1}
              />
            );
          })}

          {data.map((d, i) => {
            const cx = bandWidth * i + bandWidth / 2;
            const value = d.value ?? 0;
            const barHeight = (value / 100) * plotHeight;
            const y = PAD_TOP + plotHeight - barHeight;
            const radius = 4;
            const isHovered = hovered === i;
            return (
              <g
                key={d.label}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${d.label}: ${d.value === null ? "ainda não feito" : `${d.value}%`}`}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={cx - barWidth / 2 - 12}
                  y={PAD_TOP}
                  width={barWidth + 24}
                  height={plotHeight}
                  fill="transparent"
                />
                {d.value !== null ? (
                  <>
                    <rect
                      x={cx - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, radius)}
                      rx={radius}
                      fill={d.color}
                      opacity={isHovered ? 1 : 0.92}
                    />
                    {barHeight > radius && (
                      <rect
                        x={cx - barWidth / 2}
                        y={PAD_TOP + plotHeight - radius}
                        width={barWidth}
                        height={radius}
                        fill={d.color}
                        opacity={isHovered ? 1 : 0.92}
                      />
                    )}
                    <text
                      x={cx}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="#1e1b2e"
                    >
                      {d.value}%
                    </text>
                  </>
                ) : (
                  <rect
                    x={cx - barWidth / 2}
                    y={PAD_TOP + plotHeight - 3}
                    width={barWidth}
                    height={3}
                    rx={1.5}
                    fill="#c3c2b7"
                  />
                )}
                <text
                  x={cx}
                  y={H - padBottom + (manyBars ? 14 : 20)}
                  textAnchor={manyBars ? "end" : "middle"}
                  transform={manyBars ? `rotate(-30 ${cx} ${H - padBottom + 14})` : undefined}
                  fontSize={manyBars ? 10 : 11}
                  fill="#635f78"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hovered !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{
              left: `${((bandWidth * hovered + bandWidth / 2) / W) * 100}%`,
              top: `${((PAD_TOP + plotHeight - ((data[hovered].value ?? 0) / 100) * plotHeight - 12) / H) * 100}%`,
            }}
          >
            {data[hovered].label}:{" "}
            {data[hovered].value === null ? "ainda não feito" : `${data[hovered].value}%`}
          </div>
        )}
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-muted hover:text-foreground">
          Ver dados em tabela
        </summary>
        <table className="mt-2 w-full text-left text-xs">
          <caption className="sr-only">Percentual de acertos por tópico</caption>
          <thead>
            <tr className="text-muted">
              <th scope="col" className="py-1 pr-4 font-medium">
                Tópico
              </th>
              <th scope="col" className="py-1 font-medium">
                Acertos
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={`${gid}-${d.label}`} className="border-t border-border">
                <td className="py-1.5 pr-4 text-foreground">{d.label}</td>
                <td className="py-1.5 text-foreground">
                  {d.value === null ? "Ainda não feito" : `${d.value}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

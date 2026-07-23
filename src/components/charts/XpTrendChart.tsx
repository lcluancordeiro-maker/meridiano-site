"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

export type XpDatum = {
  date: string; // YYYY-MM-DD
  xp: number;
};

const W = 480;
const H = 200;
const PAD_BOTTOM = 28;
const PAD_TOP = 20;
const PAD_LEFT = 28;
const SEQUENTIAL_BLUE = "#2a78d6";

function niceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let step;
  if (residual > 5) step = 10 * magnitude;
  else if (residual > 2) step = 5 * magnitude;
  else step = 2 * magnitude;
  return step;
}

export default function XpTrendChart({ data }: { data: XpDatum[] }) {
  const { dict } = useTranslation();
  const t = dict.progresso;
  const [hovered, setHovered] = useState<number | null>(null);
  const plotWidth = W - PAD_LEFT;
  const plotHeight = H - PAD_BOTTOM - PAD_TOP;
  const bandWidth = plotWidth / data.length;
  const barWidth = Math.min(24, bandWidth * 0.55);

  const maxValue = niceMax(Math.max(...data.map((d) => d.xp), 1));
  const yTicks = [0, maxValue / 2, maxValue];

  const maxIndex = data.reduce(
    (best, d, i) => (d.xp > data[best].xp ? i : best),
    0
  );
  const todayIndex = data.length - 1;

  return (
    <div>
      <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label={`${t.chartXpCaption}: ${data.reduce((s, d) => s + d.xp, 0)} XP`}
        >
          {yTicks.map((tick) => {
            const y = PAD_TOP + plotHeight - (tick / maxValue) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={PAD_LEFT}
                  x2={W}
                  y1={y}
                  y2={y}
                  stroke="#e4e2f1"
                  strokeWidth={1}
                />
                <text x={0} y={y + 3} fontSize={10} fill="#898781">
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => {
            const cx = PAD_LEFT + bandWidth * i + bandWidth / 2;
            const barHeight = (d.xp / maxValue) * plotHeight;
            const y = PAD_TOP + plotHeight - barHeight;
            const radius = 4;
            const isHovered = hovered === i;
            const weekday = t.weekdayLabels[new Date(d.date + "T00:00:00").getDay()];
            const shouldLabel = i === maxIndex || i === todayIndex;

            return (
              <g
                key={d.date}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${weekday}: ${d.xp} XP`}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={cx - bandWidth / 2}
                  y={PAD_TOP}
                  width={bandWidth}
                  height={plotHeight}
                  fill="transparent"
                />
                {d.xp > 0 ? (
                  <>
                    <rect
                      x={cx - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, radius)}
                      rx={radius}
                      fill={SEQUENTIAL_BLUE}
                      opacity={isHovered ? 1 : 0.9}
                    />
                    {barHeight > radius && (
                      <rect
                        x={cx - barWidth / 2}
                        y={PAD_TOP + plotHeight - radius}
                        width={barWidth}
                        height={radius}
                        fill={SEQUENTIAL_BLUE}
                        opacity={isHovered ? 1 : 0.9}
                      />
                    )}
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
                {shouldLabel && d.xp > 0 && (
                  <text x={cx} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e1b2e">
                    {d.xp}
                  </text>
                )}
                <text x={cx} y={H - PAD_BOTTOM + 16} textAnchor="middle" fontSize={10} fill="#635f78">
                  {i === todayIndex ? t.chartToday : weekday}
                </text>
              </g>
            );
          })}
        </svg>

        {hovered !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{
              left: `${((PAD_LEFT + bandWidth * hovered + bandWidth / 2) / W) * 100}%`,
              top: `${((PAD_TOP + plotHeight - (data[hovered].xp / maxValue) * plotHeight - 12) / H) * 100}%`,
            }}
          >
            {data[hovered].xp} XP
          </div>
        )}
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-muted hover:text-foreground">
          {t.chartViewTable}
        </summary>
        <table className="mt-2 w-full text-left text-xs">
          <caption className="sr-only">{t.chartXpCaption}</caption>
          <thead>
            <tr className="text-muted">
              <th scope="col" className="py-1 pr-4 font-medium">
                {t.chartDateColumn}
              </th>
              <th scope="col" className="py-1 font-medium">
                XP
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-t border-border">
                <td className="py-1.5 pr-4 text-foreground">{d.date}</td>
                <td className="py-1.5 text-foreground">{d.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

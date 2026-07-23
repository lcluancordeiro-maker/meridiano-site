"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { buildHeatmapWeeks, heatmapIntensity } from "@/lib/studyHeatmap";

const CELL = 12;
const GAP = 3;
const INTENSITY_OPACITY = [0.08, 0.32, 0.55, 0.78, 1];

export default function StudyHeatmap({ data }: { data: { date: string; xp: number }[] }) {
  const { dict } = useTranslation();
  const t = dict.progresso;
  const [hovered, setHovered] = useState<string | null>(null);
  const weeks = buildHeatmapWeeks(data);
  const totalXp = data.reduce((s, d) => s + d.xp, 0);

  const width = weeks.length * (CELL + GAP) - GAP;
  const height = 7 * (CELL + GAP) - GAP;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block"
          role="img"
          aria-label={`${t.studyActivity}: ${totalXp} XP`}
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day) return null;
              const intensity = heatmapIntensity(day.xp);
              const isHovered = hovered === day.date;
              return (
                <rect
                  key={day.date}
                  x={wi * (CELL + GAP)}
                  y={di * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill="var(--color-primary)"
                  opacity={INTENSITY_OPACITY[intensity]}
                  stroke={isHovered ? "var(--color-foreground)" : "transparent"}
                  strokeWidth={1.5}
                  onPointerEnter={() => setHovered(day.date)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(day.date)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${day.date}: ${day.xp} XP`}
                  style={{ cursor: "pointer" }}
                />
              );
            })
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>{t.heatmapCaption}</span>
        <div className="flex items-center gap-1" data-testid="heatmap-legend">
          <span>{t.heatmapLess}</span>
          {INTENSITY_OPACITY.map((opacity) => (
            <span
              key={opacity}
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: "var(--color-primary)", opacity }}
            />
          ))}
          <span>{t.heatmapMore}</span>
        </div>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-muted hover:text-foreground">
          {t.chartViewTable}
        </summary>
        <table className="mt-2 w-full text-left text-xs" data-testid="heatmap-table">
          <caption className="sr-only">{t.studyActivity}</caption>
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

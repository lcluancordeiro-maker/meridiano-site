export type HeatmapDay = { date: string; xp: number; weekday: number };

/**
 * Chunks daily XP data (oldest first) into GitHub-style weeks (Sun..Sat
 * columns of 7). Pads the first week with leading nulls so the first real
 * day lands in its correct weekday slot, and pads the last week with
 * trailing nulls to complete it.
 */
export function buildHeatmapWeeks(
  data: { date: string; xp: number }[]
): (HeatmapDay | null)[][] {
  if (data.length === 0) return [];

  const days: HeatmapDay[] = data.map((d) => ({
    ...d,
    weekday: new Date(`${d.date}T00:00:00`).getDay(),
  }));

  const leadingPad = days[0].weekday;
  const padded: (HeatmapDay | null)[] = [...Array(leadingPad).fill(null), ...days];
  const trailingPad = (7 - (padded.length % 7)) % 7;
  padded.push(...Array(trailingPad).fill(null));

  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Fixed absolute XP thresholds (not per-user quantiles) so a given
 * intensity level means the same thing across different users and weeks.
 */
export function heatmapIntensity(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (xp < 15) return 1;
  if (xp < 40) return 2;
  if (xp < 80) return 3;
  return 4;
}

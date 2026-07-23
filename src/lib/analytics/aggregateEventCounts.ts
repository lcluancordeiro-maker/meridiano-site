export type AnalyticsEventRow = { event_name: string; created_at: string };

export type EventCountsTable = {
  /** Oldest-to-newest ISO dates (YYYY-MM-DD), one column per day. */
  dates: string[];
  /** One row per distinct event name, sorted by total descending. */
  rows: { eventName: string; total: number; countsByDate: Record<string, number> }[];
};

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Turns raw analytics_events rows into a small daily-counts table for the
 * admin dashboard — the last `days` calendar days (today inclusive), one
 * row per event name, most-frequent first. Pure so it's testable without
 * a real Supabase query. */
export function aggregateEventCounts(rows: AnalyticsEventRow[], days: number, now: Date = new Date()): EventCountsTable {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const dateSet = new Set(dates);

  const totals = new Map<string, number>();
  const perDate = new Map<string, Record<string, number>>();

  for (const row of rows) {
    const dateKey = toDateKey(row.created_at);
    if (!dateSet.has(dateKey)) continue;

    totals.set(row.event_name, (totals.get(row.event_name) ?? 0) + 1);
    const counts = perDate.get(row.event_name) ?? {};
    counts[dateKey] = (counts[dateKey] ?? 0) + 1;
    perDate.set(row.event_name, counts);
  }

  const rowsOut = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([eventName, total]) => ({
      eventName,
      total,
      countsByDate: perDate.get(eventName) ?? {},
    }));

  return { dates, rows: rowsOut };
}

import { describe, expect, it } from "vitest";
import { aggregateEventCounts } from "./aggregateEventCounts";

const NOW = new Date("2026-07-22T15:00:00.000Z");

describe("aggregateEventCounts", () => {
  it("returns an empty rows list and the full date range when there are no events", () => {
    const table = aggregateEventCounts([], 3, NOW);
    expect(table.dates).toEqual(["2026-07-20", "2026-07-21", "2026-07-22"]);
    expect(table.rows).toEqual([]);
  });

  it("counts events per day and sorts event names by total descending", () => {
    const table = aggregateEventCounts(
      [
        { event_name: "signup", created_at: "2026-07-22T10:00:00.000Z" },
        { event_name: "exercicio_concluido", created_at: "2026-07-22T11:00:00.000Z" },
        { event_name: "exercicio_concluido", created_at: "2026-07-22T12:00:00.000Z" },
        { event_name: "exercicio_concluido", created_at: "2026-07-21T09:00:00.000Z" },
      ],
      3,
      NOW
    );

    expect(table.rows).toEqual([
      {
        eventName: "exercicio_concluido",
        total: 3,
        countsByDate: { "2026-07-22": 2, "2026-07-21": 1 },
      },
      { eventName: "signup", total: 1, countsByDate: { "2026-07-22": 1 } },
    ]);
  });

  it("ignores events older than the requested window", () => {
    const table = aggregateEventCounts(
      [{ event_name: "signup", created_at: "2026-07-01T00:00:00.000Z" }],
      3,
      NOW
    );
    expect(table.rows).toEqual([]);
  });
});

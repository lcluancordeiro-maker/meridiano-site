import { describe, expect, it } from "vitest";
import { buildHeatmapWeeks, heatmapIntensity } from "./studyHeatmap";

describe("buildHeatmapWeeks", () => {
  it("returns an empty array for no data", () => {
    expect(buildHeatmapWeeks([])).toEqual([]);
  });

  it("pads the first week so the first day lands in its weekday slot", () => {
    // 2026-07-01 is a Wednesday (weekday 3)
    const weeks = buildHeatmapWeeks([{ date: "2026-07-01", xp: 10 }]);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]).toEqual([null, null, null, { date: "2026-07-01", xp: 10, weekday: 3 }, null, null, null]);
  });

  it("pads the last week to a full 7 cells", () => {
    // 2026-07-05 is a Sunday (weekday 0)
    const data = [
      { date: "2026-07-05", xp: 5 },
      { date: "2026-07-06", xp: 0 },
    ];
    const weeks = buildHeatmapWeeks(data);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0]).toEqual({ date: "2026-07-05", xp: 5, weekday: 0 });
    expect(weeks[0][1]).toEqual({ date: "2026-07-06", xp: 0, weekday: 1 });
    expect(weeks[0].slice(2)).toEqual([null, null, null, null, null]);
  });

  it("splits multiple weeks correctly", () => {
    const data = Array.from({ length: 10 }, (_, i) => {
      const d = new Date("2026-07-05T00:00:00");
      d.setDate(d.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { date: iso, xp: i };
    });
    const weeks = buildHeatmapWeeks(data);
    expect(weeks).toHaveLength(2);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[1]).toHaveLength(7);
    expect(weeks[1][2]).toEqual({ date: "2026-07-14", xp: 9, weekday: 2 });
    expect(weeks[1].slice(3)).toEqual([null, null, null, null]);
  });
});

describe("heatmapIntensity", () => {
  it("returns 0 for no activity", () => {
    expect(heatmapIntensity(0)).toBe(0);
  });

  it("buckets increasing xp into higher intensities", () => {
    expect(heatmapIntensity(5)).toBe(1);
    expect(heatmapIntensity(20)).toBe(2);
    expect(heatmapIntensity(50)).toBe(3);
    expect(heatmapIntensity(100)).toBe(4);
  });

  it("treats negative xp the same as zero", () => {
    expect(heatmapIntensity(-5)).toBe(0);
  });
});

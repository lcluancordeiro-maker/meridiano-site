import { describe, expect, it } from "vitest";
import { mapIntervalToPixSchedule } from "./pixSchedule";

describe("mapIntervalToPixSchedule", () => {
  it("maps a weekly price", () => {
    expect(mapIntervalToPixSchedule("week", 1)).toBe("weekly");
  });

  it("maps a yearly price", () => {
    expect(mapIntervalToPixSchedule("year", 1)).toBe("yearly");
  });

  it("maps a plain monthly price", () => {
    expect(mapIntervalToPixSchedule("month", 1)).toBe("monthly");
  });

  it("maps a quarterly (every-3-months) price", () => {
    expect(mapIntervalToPixSchedule("month", 3)).toBe("quarterly");
  });

  it("maps a half-yearly (every-6-months) price", () => {
    expect(mapIntervalToPixSchedule("month", 6)).toBe("halfyearly");
  });

  it("falls back to monthly for intervals Pix has no matching cadence for", () => {
    expect(mapIntervalToPixSchedule("day", 1)).toBe("monthly");
    expect(mapIntervalToPixSchedule("month", 2)).toBe("monthly");
  });
});

import { describe, expect, it } from "vitest";
import { buildWeeklyDigestEmail, startOfWeekUTC, sumWeeklyXp } from "./weeklyDigest";

describe("startOfWeekUTC", () => {
  it("returns the same Monday when now is already Monday", () => {
    // 2026-01-05 is a Monday
    const result = startOfWeekUTC(new Date("2026-01-05T15:30:00Z"));
    expect(result.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("rolls back to the previous Monday for a mid-week date", () => {
    // 2026-01-08 is a Thursday
    const result = startOfWeekUTC(new Date("2026-01-08T09:00:00Z"));
    expect(result.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("rolls back correctly across a Sunday (treated as the last day of the week)", () => {
    // 2026-01-11 is a Sunday, belongs to the week starting 2026-01-05
    const result = startOfWeekUTC(new Date("2026-01-11T23:59:00Z"));
    expect(result.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });
});

describe("sumWeeklyXp", () => {
  const now = new Date("2026-01-08T12:00:00Z"); // Thursday, week starts 2026-01-05

  it("sums only entries within the current week", () => {
    const xpLog = {
      "2026-01-04": 50, // last Sunday, previous week
      "2026-01-05": 10, // Monday, this week
      "2026-01-07": 20, // Wednesday, this week
    };
    expect(sumWeeklyXp(xpLog, now)).toBe(30);
  });

  it("returns 0 for an empty log", () => {
    expect(sumWeeklyXp({}, now)).toBe(0);
  });

  it("includes today's entry", () => {
    const xpLog = { "2026-01-08": 15 };
    expect(sumWeeklyXp(xpLog, now)).toBe(15);
  });
});

describe("buildWeeklyDigestEmail", () => {
  it("includes the student's name, xp, exercise count and streak", () => {
    const html = buildWeeklyDigestEmail({
      studentName: "Maria",
      weeklyXp: 120,
      exercisesCompletedThisWeek: 8,
      streakCurrent: 5,
    });
    expect(html).toContain("Maria");
    expect(html).toContain("120 XP");
    expect(html).toContain("8");
    expect(html).toContain("5");
    expect(html).toContain("dias seguidos");
  });

  it("uses singular wording for a count of exactly 1", () => {
    const html = buildWeeklyDigestEmail({
      studentName: "João",
      weeklyXp: 5,
      exercisesCompletedThisWeek: 1,
      streakCurrent: 1,
    });
    expect(html).toContain("exercício concluído");
    expect(html).not.toContain("exercícios concluídos");
    expect(html).toContain("dia seguido");
    expect(html).not.toContain("dias seguidos");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DAILY_CHALLENGE_BONUS_XP,
  __resetDailyChallengeForTests,
  getDailyChallenge,
  getDailyChallengeStateSnapshot,
  hasAnsweredToday,
  recordDailyChallengeAttempt,
} from "./dailyChallenge";
import { __resetGamificationForTests, getGamificationSnapshot } from "./gamification";
import { getLevel } from "@/data/curriculum";

beforeEach(() => {
  window.localStorage.clear();
  __resetDailyChallengeForTests();
  __resetGamificationForTests();
  vi.useRealTimers();
});

describe("getDailyChallenge", () => {
  it("picks the same problem for the same calendar date", () => {
    const date = new Date("2026-03-10T08:00:00");
    const a = getDailyChallenge(date);
    const b = getDailyChallenge(new Date("2026-03-10T22:00:00"));
    expect(a).not.toBeNull();
    expect(a).toBe(b);
  });

  it("only picks from available, non-premium levels", () => {
    const problem = getDailyChallenge(new Date("2026-03-10T08:00:00"));
    const level = getLevel(problem!.levelId);
    expect(level?.available).toBe(true);
    expect(level?.premium).toBe(false);
  });

  it("only picks fácil or médio exercises", () => {
    const dates = ["2026-01-01", "2026-02-14", "2026-03-30", "2026-07-04", "2026-11-23"];
    for (const d of dates) {
      const problem = getDailyChallenge(new Date(`${d}T08:00:00`));
      expect(["facil", "medio"]).toContain(problem!.exercise.difficulty);
    }
  });

  it("varies across different dates", () => {
    const problems = new Set(
      ["2026-01-01", "2026-02-14", "2026-03-30", "2026-07-04", "2026-11-23", "2026-12-25"].map(
        (d) => `${getDailyChallenge(new Date(`${d}T08:00:00`))!.topicId}/${getDailyChallenge(new Date(`${d}T08:00:00`))!.exercise.id}`
      )
    );
    expect(problems.size).toBeGreaterThan(1);
  });
});

describe("recordDailyChallengeAttempt", () => {
  it("marks today as answered and is idempotent", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00"));

    expect(hasAnsweredToday()).toBe(false);
    recordDailyChallengeAttempt(true);
    expect(hasAnsweredToday()).toBe(true);

    const afterFirst = getDailyChallengeStateSnapshot();
    recordDailyChallengeAttempt(false); // second attempt same day is a no-op
    expect(getDailyChallengeStateSnapshot()).toEqual(afterFirst);
  });

  it("awards the bonus XP only when correct", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00"));
    recordDailyChallengeAttempt(false);
    expect(getGamificationSnapshot().xp).toBe(0);

    __resetDailyChallengeForTests();
    __resetGamificationForTests();
    window.localStorage.clear();
    vi.setSystemTime(new Date("2026-03-11T12:00:00"));
    recordDailyChallengeAttempt(true);
    expect(getGamificationSnapshot().xp).toBe(DAILY_CHALLENGE_BONUS_XP);
  });

  it("builds a streak across consecutive days regardless of correctness, and resets after a gap", () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-03-10T12:00:00"));
    recordDailyChallengeAttempt(true);
    expect(getDailyChallengeStateSnapshot().current).toBe(1);

    vi.setSystemTime(new Date("2026-03-11T12:00:00"));
    recordDailyChallengeAttempt(false); // wrong answer still extends the streak
    expect(getDailyChallengeStateSnapshot().current).toBe(2);

    vi.setSystemTime(new Date("2026-03-13T12:00:00")); // skipped the 12th
    recordDailyChallengeAttempt(true);
    expect(getDailyChallengeStateSnapshot().current).toBe(1);
    expect(getDailyChallengeStateSnapshot().longest).toBe(2);
  });
});

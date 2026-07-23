import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetReviewScheduleForTests,
  getDueReviews,
  getReviewSnapshot,
  hydrateReviewScheduleFromCloud,
  recordReviewResult,
} from "./reviewSchedule";

const DAY_MS = 24 * 60 * 60 * 1000;

beforeEach(() => {
  window.localStorage.clear();
  __resetReviewScheduleForTests();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("recordReviewResult / getDueReviews", () => {
  it("schedules a 1-day interval after the first correct answer", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    const snapshot = getReviewSnapshot();
    const entry = snapshot["fundamental-2/fracoes/m1"];
    expect(entry).toMatchObject({ intervalDays: 1, lastResult: "correct" });
    expect(entry.dueAt).toBe(Date.now() + DAY_MS);
  });

  it("doubles the interval on each subsequent correct answer", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    const entry = getReviewSnapshot()["fundamental-2/fracoes/m1"];
    expect(entry.intervalDays).toBe(4);
  });

  it("caps the interval instead of growing forever", () => {
    for (let i = 0; i < 10; i++) {
      recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    }
    const entry = getReviewSnapshot()["fundamental-2/fracoes/m1"];
    expect(entry.intervalDays).toBeLessThanOrEqual(60);
  });

  it("resets the interval back to 1 day after an incorrect answer", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", false);
    const entry = getReviewSnapshot()["fundamental-2/fracoes/m1"];
    expect(entry).toMatchObject({ intervalDays: 1, lastResult: "incorrect" });
  });

  it("keeps different exercises independent", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    recordReviewResult("fundamental-2", "fracoes", "medio", "m2", false);
    expect(getReviewSnapshot()["fundamental-2/fracoes/m1"].lastResult).toBe("correct");
    expect(getReviewSnapshot()["fundamental-2/fracoes/m2"].lastResult).toBe("incorrect");
  });

  it("does not surface a freshly-scheduled entry as due yet", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    expect(getDueReviews()).toHaveLength(0);
  });

  it("surfaces an entry once its due date has passed", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    vi.setSystemTime(new Date(Date.now() + DAY_MS + 1));
    const due = getDueReviews();
    expect(due).toHaveLength(1);
    expect(due[0].exerciseId).toBe("m1");
  });

  it("sorts due reviews with the longest-overdue entry first", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    vi.setSystemTime(new Date(Date.now() + 500));
    recordReviewResult("fundamental-2", "fracoes", "medio", "m2", true);
    vi.setSystemTime(new Date(Date.now() + 2 * DAY_MS));
    const due = getDueReviews();
    expect(due.map((e) => e.exerciseId)).toEqual(["m1", "m2"]);
  });
});

describe("hydrateReviewScheduleFromCloud", () => {
  it("replaces local state with the given rows", () => {
    recordReviewResult("fundamental-2", "fracoes", "medio", "m1", true);
    hydrateReviewScheduleFromCloud([
      {
        levelId: "medio",
        topicId: "funcao-quadratica",
        exerciseId: "d1",
        difficulty: "dificil",
        intervalDays: 2,
        dueAt: Date.now(),
        lastResult: "correct",
        updatedAt: Date.now(),
      },
    ]);
    const snapshot = getReviewSnapshot();
    expect(snapshot["fundamental-2/fracoes/m1"]).toBeUndefined();
    expect(snapshot["medio/funcao-quadratica/d1"]).toMatchObject({ intervalDays: 2 });
  });
});

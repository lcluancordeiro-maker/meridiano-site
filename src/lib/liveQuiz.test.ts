import { describe, expect, it } from "vitest";
import type { Exercise } from "@/data/curriculum";
import {
  LIVE_QUIZ_MAX_QUESTIONS,
  LIVE_QUIZ_QUESTION_SECONDS,
  computeLiveQuizPoints,
  isLiveQuizAnswerCorrect,
  isLiveQuizAnswerTooLate,
  liveQuizQuestionDeadline,
  pickLiveQuizExercises,
} from "./liveQuiz";

function exercise(overrides: Partial<Exercise>): Exercise {
  return {
    id: "ex-1",
    prompt: "2 + 2 = ?",
    type: "multiple-choice",
    difficulty: "facil",
    options: ["3", "4", "5"],
    answer: "4",
    explanation: "2 + 2 = 4",
    ...overrides,
  };
}

describe("pickLiveQuizExercises", () => {
  it("keeps only multiple-choice exercises at the requested difficulty", () => {
    const exercises = [
      exercise({ id: "a", difficulty: "facil", type: "multiple-choice" }),
      exercise({ id: "b", difficulty: "medio", type: "multiple-choice" }),
      exercise({ id: "c", difficulty: "facil", type: "numeric" }),
    ];
    const picked = pickLiveQuizExercises(exercises, "facil");
    expect(picked.map((e) => e.id)).toEqual(["a"]);
  });

  it("caps the pool at LIVE_QUIZ_MAX_QUESTIONS", () => {
    const exercises = Array.from({ length: LIVE_QUIZ_MAX_QUESTIONS + 5 }, (_, i) =>
      exercise({ id: `ex-${i}` })
    );
    expect(pickLiveQuizExercises(exercises, "facil")).toHaveLength(LIVE_QUIZ_MAX_QUESTIONS);
  });

  it("returns an empty array when nothing matches", () => {
    const exercises = [exercise({ difficulty: "dificil" })];
    expect(pickLiveQuizExercises(exercises, "facil")).toEqual([]);
  });
});

describe("isLiveQuizAnswerCorrect", () => {
  it("is case/whitespace insensitive, matching ExerciseQuiz's own normalize", () => {
    expect(isLiveQuizAnswerCorrect(" 4 ", "4")).toBe(true);
    expect(isLiveQuizAnswerCorrect("Sim", "sim")).toBe(true);
    expect(isLiveQuizAnswerCorrect("3", "4")).toBe(false);
  });
});

describe("computeLiveQuizPoints", () => {
  it("scores 0 for a wrong answer regardless of speed", () => {
    expect(computeLiveQuizPoints(false, 0)).toBe(0);
    expect(computeLiveQuizPoints(false, 19000)).toBe(0);
  });

  it("scores the maximum for an instant correct answer", () => {
    expect(computeLiveQuizPoints(true, 0)).toBe(1000);
  });

  it("scores the minimum for a correct answer right at the deadline", () => {
    expect(computeLiveQuizPoints(true, LIVE_QUIZ_QUESTION_SECONDS * 1000)).toBe(500);
  });

  it("scores in between for a correct answer partway through", () => {
    const points = computeLiveQuizPoints(true, (LIVE_QUIZ_QUESTION_SECONDS * 1000) / 2);
    expect(points).toBeGreaterThan(500);
    expect(points).toBeLessThan(1000);
  });

  it("clamps an implausible negative or over-long elapsed time", () => {
    expect(computeLiveQuizPoints(true, -500)).toBe(1000);
    expect(computeLiveQuizPoints(true, 999_999)).toBe(500);
  });
});

describe("isLiveQuizAnswerTooLate", () => {
  it("accepts an answer within the question window", () => {
    expect(isLiveQuizAnswerTooLate(19_000)).toBe(false);
  });

  it("accepts an answer inside the grace window past the deadline", () => {
    expect(isLiveQuizAnswerTooLate(LIVE_QUIZ_QUESTION_SECONDS * 1000 + 1000)).toBe(false);
  });

  it("rejects an answer past the grace window", () => {
    expect(isLiveQuizAnswerTooLate(LIVE_QUIZ_QUESTION_SECONDS * 1000 + 5000)).toBe(true);
  });
});

describe("liveQuizQuestionDeadline", () => {
  it("adds questionSeconds to the start time, accepting a string or Date", () => {
    const startedAt = new Date("2026-01-01T00:00:00.000Z");
    const expected = startedAt.getTime() + LIVE_QUIZ_QUESTION_SECONDS * 1000;
    expect(liveQuizQuestionDeadline(startedAt)).toBe(expected);
    expect(liveQuizQuestionDeadline(startedAt.toISOString())).toBe(expected);
  });
});

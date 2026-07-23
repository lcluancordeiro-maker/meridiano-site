import type { Difficulty, Exercise } from "@/data/curriculum";

/** Fixed per-session, not per-question — keeps the host UI and the
 * countdown simple (one timer shape for the whole quiz). */
export const LIVE_QUIZ_QUESTION_SECONDS = 20;
export const LIVE_QUIZ_MAX_QUESTIONS = 10;

const MIN_POINTS = 500;
const MAX_POINTS = 1000;

/** Extra time (beyond question_seconds) a late submission is still
 * accepted for, to absorb normal request latency without letting
 * students answer arbitrarily late. */
export const LIVE_QUIZ_ANSWER_GRACE_MS = 1500;

/** Kahoot-style question pool: multiple-choice only (a live quiz needs
 * tappable options, not a numeric keypad), capped at
 * LIVE_QUIZ_MAX_QUESTIONS so a session stays a short, single sitting. */
export function pickLiveQuizExercises(exercises: Exercise[], difficulty: Difficulty): Exercise[] {
  return exercises
    .filter((exercise) => exercise.difficulty === difficulty && exercise.type === "multiple-choice")
    .slice(0, LIVE_QUIZ_MAX_QUESTIONS);
}

function normalizeLiveQuizAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function isLiveQuizAnswerCorrect(submitted: string, correctAnswer: string): boolean {
  return normalizeLiveQuizAnswer(submitted) === normalizeLiveQuizAnswer(correctAnswer);
}

/** Kahoot-style speed bonus: a correct answer is worth MAX_POINTS at
 * elapsedMs=0, decaying linearly down to MIN_POINTS right at the
 * deadline. Wrong answers always score 0 — being fast isn't worth
 * anything if the answer is wrong. */
export function computeLiveQuizPoints(
  isCorrect: boolean,
  elapsedMs: number,
  questionSeconds: number = LIVE_QUIZ_QUESTION_SECONDS
): number {
  if (!isCorrect) return 0;
  const questionMs = questionSeconds * 1000;
  const clampedElapsed = Math.min(Math.max(elapsedMs, 0), questionMs);
  const speedFraction = 1 - clampedElapsed / questionMs;
  return Math.round(MIN_POINTS + (MAX_POINTS - MIN_POINTS) * speedFraction);
}

/** A submission arriving after questionSeconds + the grace window is
 * treated as too late to score, regardless of what the client claims
 * elapsed — the deadline is always derived from the server-stored
 * question_started_at, never a client-supplied timestamp. */
export function isLiveQuizAnswerTooLate(
  elapsedMs: number,
  questionSeconds: number = LIVE_QUIZ_QUESTION_SECONDS
): boolean {
  return elapsedMs > questionSeconds * 1000 + LIVE_QUIZ_ANSWER_GRACE_MS;
}

export function liveQuizQuestionDeadline(
  questionStartedAt: string | Date,
  questionSeconds: number = LIVE_QUIZ_QUESTION_SECONDS
): number {
  const startedMs =
    typeof questionStartedAt === "string" ? new Date(questionStartedAt).getTime() : questionStartedAt.getTime();
  return startedMs + questionSeconds * 1000;
}

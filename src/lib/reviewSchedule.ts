import type { Difficulty } from "@/data/curriculum";

export type ReviewResult = "correct" | "incorrect";

export type ReviewEntry = {
  levelId: string;
  topicId: string;
  exerciseId: string;
  difficulty: Difficulty;
  intervalDays: number;
  dueAt: number;
  lastResult: ReviewResult;
  updatedAt: number;
};

export type ReviewStore = Record<string, ReviewEntry>;

const STORAGE_KEY = "meridiano-math-review-schedule";
const DAY_MS = 24 * 60 * 60 * 1000;
/** Interval doubles on every correct answer (SM-2-lite) but is capped so a
 * well-known exercise still resurfaces every couple of months instead of
 * being pushed out indefinitely. */
const MAX_INTERVAL_DAYS = 60;

function reviewKey(levelId: string, topicId: string, exerciseId: string): string {
  return `${levelId}/${topicId}/${exerciseId}`;
}

function readStore(): ReviewStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReviewStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ReviewStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// In-memory cache so useSyncExternalStore can return a stable reference
// between renders. The reference is replaced (not mutated) on every write
// so identity comparisons correctly detect changes.
let cache: ReviewStore | null = null;

function ensureCache(): ReviewStore {
  if (!cache) cache = readStore();
  return cache;
}

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeReviewSchedule(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReviewSnapshot(): ReviewStore {
  return ensureCache();
}

/** Records the outcome of answering a specific exercise and schedules its
 * next review: a correct answer doubles the interval since the last one (or
 * starts at 1 day), an incorrect answer resets it back to 1 day. */
export function recordReviewResult(
  levelId: string,
  topicId: string,
  difficulty: Difficulty,
  exerciseId: string,
  correct: boolean
): void {
  const key = reviewKey(levelId, topicId, exerciseId);
  const previous = ensureCache()[key];
  const intervalDays = correct
    ? Math.min(previous ? previous.intervalDays * 2 : 1, MAX_INTERVAL_DAYS)
    : 1;
  const now = Date.now();
  const entry: ReviewEntry = {
    levelId,
    topicId,
    exerciseId,
    difficulty,
    intervalDays,
    dueAt: now + intervalDays * DAY_MS,
    lastResult: correct ? "correct" : "incorrect",
    updatedAt: now,
  };
  const next = { ...ensureCache(), [key]: entry };
  cache = next;
  writeStore(next);
  emitChange();
}

/** Entries whose review is due (dueAt in the past), earliest first. */
export function getDueReviews(now: number = Date.now()): ReviewEntry[] {
  return Object.values(ensureCache())
    .filter((entry) => entry.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt);
}

/** Replaces local state with cloud rows on login (cloud is the source of
 * truth), mirroring the hydrate pattern used for gamification state. */
export function hydrateReviewScheduleFromCloud(rows: ReviewEntry[]): void {
  const next: ReviewStore = {};
  for (const row of rows) {
    next[reviewKey(row.levelId, row.topicId, row.exerciseId)] = row;
  }
  cache = next;
  writeStore(next);
  emitChange();
}

/** Test-only: clears the in-memory cache so the next call re-reads localStorage. */
export function __resetReviewScheduleForTests(): void {
  cache = null;
  listeners.clear();
}

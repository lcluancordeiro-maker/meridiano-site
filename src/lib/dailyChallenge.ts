import { levels, getTopicsForLevel, type Exercise } from "@/data/curriculum";
import { recordBonusXp } from "./gamification";

export type DailyChallengeProblem = {
  levelId: string;
  levelName: string;
  topicId: string;
  topicTitle: string;
  exercise: Exercise;
};

export type DailyChallengeState = {
  current: number;
  longest: number;
  lastActiveDate: string | null;
  /** date (YYYY-MM-DD) -> whether that day's attempt was correct. Also
   * doubles as the "already answered today" guard. */
  history: Record<string, boolean>;
};

const STORAGE_KEY = "meridiano-math-daily-challenge";
export const DAILY_CHALLENGE_BONUS_XP = 15;

function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayStr(d = new Date()): string {
  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  return todayStr(prev);
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Only free, available levels — the Daily Challenge is a hook meant to be
 * answerable by anyone, including guests, so it never surfaces Premium
 * content. Restricted to fácil/médio so a random pick can't hand a casual
 * daily visitor a olimpiada-tier problem. */
function buildPool(): DailyChallengeProblem[] {
  const pool: DailyChallengeProblem[] = [];
  for (const level of levels) {
    if (!level.available || level.premium) continue;
    for (const topic of getTopicsForLevel(level.id)) {
      for (const exercise of topic.exercises) {
        if (exercise.difficulty !== "facil" && exercise.difficulty !== "medio") continue;
        pool.push({
          levelId: level.id,
          levelName: level.name,
          topicId: topic.id,
          topicTitle: topic.title,
          exercise,
        });
      }
    }
  }
  return pool;
}

let challengeCache: { date: string; problem: DailyChallengeProblem | null } | null = null;

/** Deterministic pick: same date → same problem for every visitor. */
export function getDailyChallenge(now = new Date()): DailyChallengeProblem | null {
  const date = todayStr(now);
  if (challengeCache && challengeCache.date === date) return challengeCache.problem;

  const pool = buildPool();
  const problem = pool.length === 0 ? null : pool[hashString(date) % pool.length];
  challengeCache = { date, problem };
  return problem;
}

function emptyState(): DailyChallengeState {
  return { current: 0, longest: 0, lastActiveDate: null, history: {} };
}

function readState(): DailyChallengeState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...(JSON.parse(raw) as DailyChallengeState) };
  } catch {
    return emptyState();
  }
}

function writeState(state: DailyChallengeState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let cache: DailyChallengeState | null = null;
const listeners = new Set<() => void>();

function ensureCache(): DailyChallengeState {
  if (!cache) cache = readState();
  return cache;
}

function commit(state: DailyChallengeState) {
  cache = state;
  writeState(state);
  listeners.forEach((l) => l());
}

export function subscribeDailyChallengeState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDailyChallengeStateSnapshot(): DailyChallengeState {
  return ensureCache();
}

export function hasAnsweredToday(state: DailyChallengeState = ensureCache()): boolean {
  return todayStr() in state.history;
}

/** Records today's attempt (correct or not). Streaks are activity-based —
 * same rule as the general practice streak: showing up counts, getting it
 * wrong doesn't break it. A second call on the same day is a no-op (the UI
 * should also prevent re-submitting once answered). */
export function recordDailyChallengeAttempt(correct: boolean): void {
  const prev = ensureCache();
  const today = todayStr();
  if (today in prev.history) return;

  const state: DailyChallengeState = { ...prev, history: { ...prev.history } };
  if (state.lastActiveDate === yesterdayStr()) {
    state.current += 1;
  } else if (state.lastActiveDate !== today) {
    state.current = 1;
  }
  state.longest = Math.max(state.longest, state.current);
  state.lastActiveDate = today;
  state.history[today] = correct;

  commit(state);

  if (correct) recordBonusXp(DAILY_CHALLENGE_BONUS_XP);
}

/** Test-only: clears in-memory caches so the next call re-reads localStorage
 * and re-derives the problem pool. */
export function __resetDailyChallengeForTests(): void {
  cache = null;
  challengeCache = null;
  listeners.clear();
}

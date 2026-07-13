import type { Difficulty } from "@/data/curriculum";

export type TopicProgress = {
  completed: boolean;
  score: number;
  total: number;
  updatedAt: number;
};

export type ProgressStore = Record<string, TopicProgress>;

const STORAGE_KEY = "meridiano-math-progress";

function readStore(): ProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ProgressStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function topicKey(levelId: string, topicId: string, difficulty: Difficulty): string {
  return `${levelId}/${topicId}/${difficulty}`;
}

// In-memory cache so useSyncExternalStore can return a stable reference
// between renders. The reference is replaced (not mutated) on every write
// so identity comparisons correctly detect changes.
let cache: ProgressStore | null = null;

function ensureCache(): ProgressStore {
  if (!cache) cache = readStore();
  return cache;
}

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTopicProgressSnapshot(
  levelId: string,
  topicId: string,
  difficulty: Difficulty
): TopicProgress | undefined {
  return ensureCache()[topicKey(levelId, topicId, difficulty)];
}

export function getAllProgressSnapshot(): ProgressStore {
  return ensureCache();
}

export function saveTopicProgress(
  levelId: string,
  topicId: string,
  difficulty: Difficulty,
  score: number,
  total: number
): void {
  const key = topicKey(levelId, topicId, difficulty);
  const value: TopicProgress = {
    completed: true,
    score,
    total,
    updatedAt: Date.now(),
  };
  const next = { ...ensureCache(), [key]: value };
  cache = next;
  writeStore(next);
  emitChange();
}

export function getAllProgress(): ProgressStore {
  return readStore();
}

/** Test-only: clears the in-memory cache so the next call re-reads localStorage. */
export function __resetProgressForTests(): void {
  cache = null;
  listeners.clear();
}

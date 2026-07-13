export type TopicProgress = {
  completed: boolean;
  score: number;
  total: number;
  updatedAt: number;
};

type ProgressStore = Record<string, TopicProgress>;

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

function topicKey(levelId: string, topicId: string): string {
  return `${levelId}/${topicId}`;
}

// In-memory cache so useSyncExternalStore can return a stable reference
// between renders instead of re-parsing localStorage every call.
const cache: ProgressStore = {};
let cacheLoaded = false;

function ensureCacheLoaded() {
  if (!cacheLoaded) {
    Object.assign(cache, readStore());
    cacheLoaded = true;
  }
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
  topicId: string
): TopicProgress | undefined {
  ensureCacheLoaded();
  return cache[topicKey(levelId, topicId)];
}

export function saveTopicProgress(
  levelId: string,
  topicId: string,
  score: number,
  total: number
): void {
  const store = readStore();
  const key = topicKey(levelId, topicId);
  const value: TopicProgress = {
    completed: true,
    score,
    total,
    updatedAt: Date.now(),
  };
  store[key] = value;
  writeStore(store);
  cache[key] = value;
  cacheLoaded = true;
  emitChange();
}

export function getAllProgress(): ProgressStore {
  return readStore();
}

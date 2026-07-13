export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const BADGES: Badge[] = [
  {
    id: "first-topic",
    name: "Primeiro passo",
    description: "Conclua seu primeiro tópico.",
    icon: "🎯",
  },
  {
    id: "perfect-score",
    name: "Nota máxima",
    description: "Acerte 100% dos exercícios de um tópico.",
    icon: "⭐",
  },
  {
    id: "fundamental-2-complete",
    name: "Fundamental II completo",
    description: "Conclua todos os tópicos do Ensino Fundamental II.",
    icon: "🏆",
  },
  {
    id: "streak-3",
    name: "Constância",
    description: "Estude 3 dias seguidos.",
    icon: "🔥",
  },
  {
    id: "streak-7",
    name: "Uma semana!",
    description: "Estude 7 dias seguidos.",
    icon: "🔥",
  },
];

export type GamificationState = {
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  unlockedBadges: string[];
  completedTopics: string[];
  xpLog: Record<string, number>;
};

const STORAGE_KEY = "meridiano-math-gamification";
export const XP_PER_CORRECT = 10;
export const XP_TOPIC_COMPLETION_BONUS = 50;

function emptyState(): GamificationState {
  return {
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null },
    unlockedBadges: [],
    completedTopics: [],
    xpLog: {},
  };
}

function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayStr(d);
}

function readState(): GamificationState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...(JSON.parse(raw) as GamificationState) };
  } catch {
    return emptyState();
  }
}

function writeState(state: GamificationState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let cache: GamificationState | null = null;
const listeners = new Set<() => void>();

function ensureCache(): GamificationState {
  if (!cache) cache = readState();
  return cache;
}

function commit(state: GamificationState) {
  cache = state;
  writeState(state);
  listeners.forEach((l) => l());
}

export function subscribeGamification(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGamificationSnapshot(): GamificationState {
  return ensureCache();
}

export function levelFromXp(xp: number): { level: number; xpIntoLevel: number; xpForNextLevel: number } {
  const level = Math.floor(xp / 100) + 1;
  return { level, xpIntoLevel: xp % 100, xpForNextLevel: 100 };
}

function unlockBadge(state: GamificationState, badgeId: string) {
  if (!state.unlockedBadges.includes(badgeId)) {
    state.unlockedBadges = [...state.unlockedBadges, badgeId];
  }
}

function updateStreak(state: GamificationState) {
  const today = todayStr();
  if (state.streak.lastActiveDate === today) return;
  if (state.streak.lastActiveDate === yesterdayStr()) {
    state.streak.current += 1;
  } else {
    state.streak.current = 1;
  }
  state.streak.longest = Math.max(state.streak.longest, state.streak.current);
  state.streak.lastActiveDate = today;

  if (state.streak.current >= 3) unlockBadge(state, "streak-3");
  if (state.streak.current >= 7) unlockBadge(state, "streak-7");
}

function addXp(state: GamificationState, amount: number) {
  state.xp += amount;
  const today = todayStr();
  state.xpLog = { ...state.xpLog, [today]: (state.xpLog[today] ?? 0) + amount };
}

/** Call once per correct exercise answer. */
export function recordCorrectAnswer(): void {
  const state = { ...ensureCache() };
  addXp(state, XP_PER_CORRECT);
  commit(state);
}

const FUNDAMENTAL_2_TOPIC_IDS = ["numeros-inteiros", "fracoes", "introducao-algebra"];

/** Call once when a topic's exercise set is finished (any attempt). */
export function recordTopicCompletion(
  levelId: string,
  topicId: string,
  score: number,
  total: number
): void {
  const prev = ensureCache();
  const state: GamificationState = {
    ...prev,
    streak: { ...prev.streak },
    xpLog: { ...prev.xpLog },
    unlockedBadges: [...prev.unlockedBadges],
    completedTopics: [...prev.completedTopics],
  };

  updateStreak(state);

  const key = `${levelId}/${topicId}`;
  const firstCompletion = !state.completedTopics.includes(key);
  if (firstCompletion) {
    state.completedTopics.push(key);
    addXp(state, XP_TOPIC_COMPLETION_BONUS);
    unlockBadge(state, "first-topic");
  }

  if (total > 0 && score === total) {
    unlockBadge(state, "perfect-score");
  }

  if (
    levelId === "fundamental-2" &&
    FUNDAMENTAL_2_TOPIC_IDS.every((id) => state.completedTopics.includes(`fundamental-2/${id}`))
  ) {
    unlockBadge(state, "fundamental-2-complete");
  }

  commit(state);
}

/** Last `days` days of XP earned, oldest first, for charting. */
export function getXpLast(days: number): { date: string; xp: number }[] {
  const state = ensureCache();
  const result: { date: string; xp: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayStr(d);
    result.push({ date: key, xp: state.xpLog[key] ?? 0 });
  }
  return result;
}

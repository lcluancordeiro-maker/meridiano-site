import { DIFFICULTY_ORDER, fundamental2Topics, type Difficulty } from "@/data/curriculum";
import { getAllProgressSnapshot } from "./progress";

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
  {
    id: "olympian",
    name: "Nível Olimpíada",
    description: "Acerte 100% de um exercício nível olimpíada.",
    icon: "🥇",
  },
  {
    id: "all-difficulties",
    name: "Todos os níveis",
    description: "Complete os 4 níveis de dificuldade de um mesmo tópico.",
    icon: "🎓",
  },
];

export const ACCENT_THEMES = ["oceano", "floresta", "por-do-sol"] as const;
export type AccentTheme = (typeof ACCENT_THEMES)[number];

export const DAILY_QUEST_IDS = ["xp30", "correct5", "perfectScore"] as const;
export type DailyQuestId = (typeof DAILY_QUEST_IDS)[number];

export type GamificationState = {
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
    /** Banked "skip a missed day" tokens — earned automatically every 7
     * consecutive days (see updateStreak), capped at MAX_STREAK_FREEZES so
     * they stay a forgiveness mechanic, not an unlimited safety net. */
    freezes: number;
  };
  unlockedBadges: string[];
  completedTopics: string[];
  xpLog: Record<string, number>;
  /** Spendable currency — earned on level-up, spent in the shop (extra
   * streak freezes, accent color themes, temporary XP boost). */
  gems: number;
  /** Epoch ms until which XP gains are doubled, or null when no boost is
   * active. Set by buyXpBoost(); stacks by extending the window rather
   * than starting a fresh one, so buying while one is already active
   * never wastes gems. */
  xpBoostUntil: number | null;
  /** Accent color themes purchased in the shop — a one-time unlock per
   * theme, not consumed on use (see accentTheme.ts for how it's applied). */
  unlockedAccentThemes: AccentTheme[];
  /** Rotating daily quests alongside the Daily Challenge — progress resets
   * whenever `date` no longer matches today (see ensureDailyQuestsForToday).
   * `claimed` guards each quest's bonus from being paid out twice in the
   * same day, the same role `history` plays in dailyChallenge.ts. */
  dailyQuests: {
    date: string;
    correctAnswersToday: number;
    perfectScoreToday: boolean;
    claimed: DailyQuestId[];
  };
};

const STORAGE_KEY = "meridiano-math-gamification";
export const XP_TOPIC_COMPLETION_BONUS = 50;
export const MAX_STREAK_FREEZES = 2;
export const DIFFICULTY_XP: Record<Difficulty, number> = {
  facil: 5,
  medio: 10,
  dificil: 15,
  olimpiada: 25,
};

// Gem economy: earn on level-up, spend in the shop.
export const GEMS_PER_LEVEL = 5;
export const GEM_COST_STREAK_FREEZE = 20;
export const GEM_COST_XP_BOOST = 30;
export const GEM_COST_ACCENT_THEME = 15;
export const XP_BOOST_MULTIPLIER = 2;
export const XP_BOOST_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Rotating daily quests: fixed targets, all active every day (not a
// rotating subset — "rotating" here means they reset daily, not that the
// set of three changes). Each pays out once per day via recordBonusXp-style
// gems + a small flat XP bonus.
export const DAILY_QUEST_XP_TARGET = 30;
export const DAILY_QUEST_CORRECT_TARGET = 5;
export const DAILY_QUEST_BONUS_GEMS = 3;
export const DAILY_QUEST_BONUS_XP = 10;

function emptyDailyQuests(): GamificationState["dailyQuests"] {
  return { date: "", correctAnswersToday: 0, perfectScoreToday: false, claimed: [] };
}

function emptyState(): GamificationState {
  return {
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
    unlockedBadges: [],
    completedTopics: [],
    xpLog: {},
    gems: 0,
    xpBoostUntil: null,
    unlockedAccentThemes: [],
    dailyQuests: emptyDailyQuests(),
  };
}

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole calendar days between a stored "YYYY-MM-DD" date and today (local
 * time) — null if there's no prior date yet (brand-new streak). */
function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((todayMidnight.getTime() - then.getTime()) / 86_400_000);
}

function readState(): GamificationState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as GamificationState;
    // Top-level spread alone wouldn't backfill `streak.freezes` for state
    // saved before that field existed — `parsed.streak` would just
    // overwrite emptyState()'s streak wholesale, leaving freezes undefined.
    // Same reasoning applies to `dailyQuests` for state saved before task
    // #215.
    return {
      ...emptyState(),
      ...parsed,
      streak: { ...emptyState().streak, ...parsed.streak },
      dailyQuests: { ...emptyDailyQuests(), ...parsed.dailyQuests },
    };
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

  const gap = daysSince(state.streak.lastActiveDate);
  if (gap === 1) {
    state.streak.current += 1;
  } else if (gap === 2 && state.streak.freezes > 0) {
    // Exactly one day missed, and a banked freeze bridges it — the streak
    // continues as if that day had happened, same spirit as Duolingo's
    // streak freeze.
    state.streak.freezes -= 1;
    state.streak.current += 1;
  } else {
    state.streak.current = 1;
  }
  state.streak.longest = Math.max(state.streak.longest, state.streak.current);
  state.streak.lastActiveDate = today;

  if (state.streak.current >= 3) unlockBadge(state, "streak-3");
  if (state.streak.current >= 7) unlockBadge(state, "streak-7");
  if (state.streak.current > 0 && state.streak.current % 7 === 0) {
    state.streak.freezes = Math.min(MAX_STREAK_FREEZES, state.streak.freezes + 1);
  }
}

function addXp(state: GamificationState, amount: number) {
  const boosted = state.xpBoostUntil !== null && Date.now() < state.xpBoostUntil;
  const effectiveAmount = boosted ? amount * XP_BOOST_MULTIPLIER : amount;

  const levelBefore = levelFromXp(state.xp).level;
  state.xp += effectiveAmount;
  const levelAfter = levelFromXp(state.xp).level;
  if (levelAfter > levelBefore) {
    state.gems += (levelAfter - levelBefore) * GEMS_PER_LEVEL;
  }

  const today = todayStr();
  state.xpLog = { ...state.xpLog, [today]: (state.xpLog[today] ?? 0) + effectiveAmount };
}

/** Resets `dailyQuests` in place whenever its stored date no longer matches
 * today — called at the start of every mutator that could affect a quest,
 * same role todayStr()-keyed history plays in dailyChallenge.ts. */
function ensureDailyQuestsForToday(state: GamificationState): void {
  const today = todayStr();
  if (state.dailyQuests.date !== today) {
    state.dailyQuests = { date: today, correctAnswersToday: 0, perfectScoreToday: false, claimed: [] };
  }
}

function claimDailyQuest(state: GamificationState, id: DailyQuestId): void {
  if (state.dailyQuests.claimed.includes(id)) return;
  state.dailyQuests = { ...state.dailyQuests, claimed: [...state.dailyQuests.claimed, id] };
  state.gems += DAILY_QUEST_BONUS_GEMS;
  addXp(state, DAILY_QUEST_BONUS_XP);
}

/** Checks every quest's completion condition against the state already
 * mutated by the caller, paying out (once per day per quest) any that just
 * became true. Safe to call unconditionally — already-claimed quests are a
 * no-op via claimDailyQuest's guard. */
function evaluateDailyQuests(state: GamificationState): void {
  ensureDailyQuestsForToday(state);
  const xpToday = state.xpLog[todayStr()] ?? 0;
  if (xpToday >= DAILY_QUEST_XP_TARGET) claimDailyQuest(state, "xp30");
  if (state.dailyQuests.correctAnswersToday >= DAILY_QUEST_CORRECT_TARGET) claimDailyQuest(state, "correct5");
  if (state.dailyQuests.perfectScoreToday) claimDailyQuest(state, "perfectScore");
}

/** Call once per correct exercise answer. */
export function recordCorrectAnswer(difficulty: Difficulty): void {
  const prev = ensureCache();
  const state: GamificationState = { ...prev, dailyQuests: { ...prev.dailyQuests } };
  ensureDailyQuestsForToday(state);
  state.dailyQuests.correctAnswersToday += 1;
  addXp(state, DIFFICULTY_XP[difficulty]);
  evaluateDailyQuests(state);
  commit(state);
}

/** Adds a flat XP bonus not tied to a specific difficulty (e.g. the Daily
 * Challenge bonus). */
export function recordBonusXp(amount: number): void {
  const prev = ensureCache();
  const state: GamificationState = { ...prev, dailyQuests: { ...prev.dailyQuests } };
  addXp(state, amount);
  evaluateDailyQuests(state);
  commit(state);
}

const FUNDAMENTAL_2_TOPIC_IDS = fundamental2Topics.map((t) => t.id);

/** Call once when a topic's exercise set is finished (any attempt). */
export function recordTopicCompletion(
  levelId: string,
  topicId: string,
  difficulty: Difficulty,
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
    dailyQuests: { ...prev.dailyQuests },
  };

  updateStreak(state);
  ensureDailyQuestsForToday(state);

  const key = `${levelId}/${topicId}`;
  const firstCompletion = !state.completedTopics.includes(key);
  if (firstCompletion) {
    state.completedTopics.push(key);
    addXp(state, XP_TOPIC_COMPLETION_BONUS);
    unlockBadge(state, "first-topic");
  }

  if (total > 0 && score === total) {
    unlockBadge(state, "perfect-score");
    state.dailyQuests.perfectScoreToday = true;
    if (difficulty === "olimpiada") {
      unlockBadge(state, "olympian");
    }
  }

  if (
    levelId === "fundamental-2" &&
    FUNDAMENTAL_2_TOPIC_IDS.every((id) => state.completedTopics.includes(`fundamental-2/${id}`))
  ) {
    unlockBadge(state, "fundamental-2-complete");
  }

  const allProgress = getAllProgressSnapshot();
  const allDifficultiesDone = DIFFICULTY_ORDER.every(
    (d) => allProgress[`${levelId}/${topicId}/${d}`]?.completed
  );
  if (allDifficultiesDone) {
    unlockBadge(state, "all-difficulties");
  }

  evaluateDailyQuests(state);
  commit(state);
}

/** Spends gems on one extra banked streak freeze. Fails (no-op, returns
 * false) without enough gems or once MAX_STREAK_FREEZES is already banked —
 * same cap the free 7-day auto-grant respects, so gems can't stack an
 * unlimited safety net. */
export function buyStreakFreeze(): boolean {
  const prev = ensureCache();
  if (prev.gems < GEM_COST_STREAK_FREEZE || prev.streak.freezes >= MAX_STREAK_FREEZES) {
    return false;
  }
  const state: GamificationState = { ...prev, streak: { ...prev.streak } };
  state.gems -= GEM_COST_STREAK_FREEZE;
  state.streak.freezes += 1;
  commit(state);
  return true;
}

/** Spends gems on an hour of double XP. Buying again while a boost is
 * already running extends it from its current end rather than restarting
 * from now, so it's never wasteful to stock up in advance. */
export function buyXpBoost(): boolean {
  const prev = ensureCache();
  if (prev.gems < GEM_COST_XP_BOOST) return false;
  const now = Date.now();
  const activeUntil = prev.xpBoostUntil !== null && prev.xpBoostUntil > now ? prev.xpBoostUntil : now;
  const state: GamificationState = {
    ...prev,
    gems: prev.gems - GEM_COST_XP_BOOST,
    xpBoostUntil: activeUntil + XP_BOOST_DURATION_MS,
  };
  commit(state);
  return true;
}

/** Spends gems to permanently unlock an accent color theme. A one-time
 * purchase per theme — buying an already-owned theme is a no-op. */
export function buyAccentTheme(theme: AccentTheme): boolean {
  const prev = ensureCache();
  if (prev.unlockedAccentThemes.includes(theme) || prev.gems < GEM_COST_ACCENT_THEME) {
    return false;
  }
  const state: GamificationState = {
    ...prev,
    gems: prev.gems - GEM_COST_ACCENT_THEME,
    unlockedAccentThemes: [...prev.unlockedAccentThemes, theme],
  };
  commit(state);
  return true;
}

/** Overwrites local state with a snapshot pulled from the cloud (used only
 * by the cloud-sync layer on login — not a normal gameplay mutation). */
export function hydrateFromCloud(state: GamificationState): void {
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

/** Test-only: clears the in-memory cache so the next call re-reads localStorage. */
export function __resetGamificationForTests(): void {
  cache = null;
  listeners.clear();
}

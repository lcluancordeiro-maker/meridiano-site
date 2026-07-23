"use client";

import { createClient } from "./supabase/client";
import {
  getAllProgressSnapshot,
  saveTopicProgress,
  subscribeProgress,
  type TopicProgress,
} from "./progress";
import {
  getGamificationSnapshot,
  hydrateFromCloud,
  subscribeGamification,
  type AccentTheme,
  type GamificationState,
} from "./gamification";
import {
  getReviewSnapshot,
  hydrateReviewScheduleFromCloud,
  subscribeReviewSchedule,
  type ReviewEntry,
} from "./reviewSchedule";
import { DIFFICULTY_ORDER, type Difficulty } from "@/data/curriculum";

type TopicProgressRow = {
  level_id: string;
  topic_id: string;
  difficulty: Difficulty;
  score: number;
  total: number;
};

type GamificationRow = {
  xp: number;
  streak_current: number;
  streak_longest: number;
  streak_last_active_date: string | null;
  streak_freezes: number;
  unlocked_badges: string[];
  completed_topics: string[];
  xp_log: Record<string, number>;
  gems: number;
  xp_boost_until: string | null;
  unlocked_accent_themes: AccentTheme[];
};

type ReviewScheduleRow = {
  level_id: string;
  topic_id: string;
  exercise_id: string;
  difficulty: Difficulty;
  interval_days: number;
  due_at: string;
  last_result: "correct" | "incorrect";
};

const supabase = createClient();

let currentUserId: string | null = null;
let initialized = false;
let syncing = false; // guards against push-during-pull feedback loops

export function getCurrentUserId(): string | null {
  return currentUserId;
}

function parseKey(key: string): { level_id: string; topic_id: string; difficulty: Difficulty } | null {
  const parts = key.split("/");
  if (parts.length !== 3) return null;
  const [level_id, topic_id, difficulty] = parts;
  return { level_id, topic_id, difficulty: difficulty as Difficulty };
}

async function pushAllProgress(userId: string) {
  if (!supabase) return;
  const snapshot = getAllProgressSnapshot();
  const rows = Object.entries(snapshot)
    .map(([key, p]) => {
      const parsed = parseKey(key);
      if (!parsed) return null;
      return { ...parsed, score: p.score, total: p.total };
    })
    .filter((r): r is TopicProgressRow => r !== null);
  if (rows.length === 0) return;

  await supabase.from("topic_progress").upsert(
    rows.map((r) => ({
      user_id: userId,
      level_id: r.level_id,
      topic_id: r.topic_id,
      difficulty: r.difficulty,
      score: r.score,
      total: r.total,
      completed: true,
    }))
  );
}

async function pushGamification(userId: string) {
  if (!supabase) return;
  const state = getGamificationSnapshot();
  await supabase.from("gamification_state").upsert({
    user_id: userId,
    xp: state.xp,
    streak_current: state.streak.current,
    streak_longest: state.streak.longest,
    streak_last_active_date: state.streak.lastActiveDate,
    streak_freezes: state.streak.freezes,
    unlocked_badges: state.unlockedBadges,
    completed_topics: state.completedTopics,
    xp_log: state.xpLog,
    gems: state.gems,
    xp_boost_until: state.xpBoostUntil !== null ? new Date(state.xpBoostUntil).toISOString() : null,
    unlocked_accent_themes: state.unlockedAccentThemes,
  });
}

async function pushReviewSchedule(userId: string) {
  if (!supabase) return;
  const snapshot = getReviewSnapshot();
  const rows = Object.values(snapshot);
  if (rows.length === 0) return;

  await supabase.from("review_schedule").upsert(
    rows.map((r) => ({
      user_id: userId,
      level_id: r.levelId,
      topic_id: r.topicId,
      exercise_id: r.exerciseId,
      difficulty: r.difficulty,
      interval_days: r.intervalDays,
      due_at: new Date(r.dueAt).toISOString(),
      last_result: r.lastResult,
    }))
  );
}

/** Pulls cloud state on login. If the account has no cloud data yet (first
 * login on any device), the current local/guest progress is pushed up
 * instead, so nothing earned before signing in is lost. Otherwise the cloud
 * is treated as the source of truth and overwrites local state. */
async function syncOnLogin(userId: string) {
  if (!supabase) return;
  syncing = true;
  try {
    const [{ data: progressRows }, { data: gamificationRow }, { data: reviewRows }] = await Promise.all([
      supabase.from("topic_progress").select("*").eq("user_id", userId),
      supabase.from("gamification_state").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("review_schedule").select("*").eq("user_id", userId),
    ]);

    const hasCloudData =
      (progressRows && progressRows.length > 0) || !!gamificationRow || (reviewRows && reviewRows.length > 0);

    if (!hasCloudData) {
      await Promise.all([pushAllProgress(userId), pushGamification(userId), pushReviewSchedule(userId)]);
      return;
    }

    for (const row of (progressRows ?? []) as (TopicProgressRow & Record<string, unknown>)[]) {
      if (!DIFFICULTY_ORDER.includes(row.difficulty)) continue;
      saveTopicProgress(row.level_id, row.topic_id, row.difficulty, row.score, row.total);
    }

    if (gamificationRow) {
      const row = gamificationRow as GamificationRow;
      const hydrated: GamificationState = {
        xp: row.xp,
        streak: {
          current: row.streak_current,
          longest: row.streak_longest,
          lastActiveDate: row.streak_last_active_date,
          freezes: row.streak_freezes ?? 0,
        },
        unlockedBadges: row.unlocked_badges ?? [],
        completedTopics: row.completed_topics ?? [],
        xpLog: row.xp_log ?? {},
        gems: row.gems ?? 0,
        xpBoostUntil: row.xp_boost_until ? new Date(row.xp_boost_until).getTime() : null,
        unlockedAccentThemes: row.unlocked_accent_themes ?? [],
      };
      hydrateFromCloud(hydrated);
    }

    if (reviewRows) {
      const entries: ReviewEntry[] = (reviewRows as ReviewScheduleRow[])
        .filter((row) => DIFFICULTY_ORDER.includes(row.difficulty))
        .map((row) => ({
          levelId: row.level_id,
          topicId: row.topic_id,
          exerciseId: row.exercise_id,
          difficulty: row.difficulty,
          intervalDays: row.interval_days,
          dueAt: new Date(row.due_at).getTime(),
          lastResult: row.last_result,
          updatedAt: Date.now(),
        }));
      hydrateReviewScheduleFromCloud(entries);
    }
  } finally {
    syncing = false;
  }
}

/** Wires up cloud sync: pulls/merges on login, and pushes local changes to
 * the cloud in the background while a session is active. No-op when
 * Supabase isn't configured (the app stays local-only). Call once, e.g.
 * from a small client component mounted near the root layout. */
export function initCloudSync(): void {
  if (initialized || !supabase) return;
  const client = supabase;
  initialized = true;

  async function loadInitialSession() {
    const {
      data: { session },
    } = await client.auth.getSession();
    const uid = session?.user.id ?? null;
    currentUserId = uid;
    if (uid) await syncOnLogin(uid);
  }
  void loadInitialSession();

  client.auth.onAuthStateChange((event, session) => {
    currentUserId = session?.user.id ?? null;
    if (event === "SIGNED_IN" && currentUserId) {
      void syncOnLogin(currentUserId);
    }
  });

  subscribeProgress(() => {
    if (syncing || !currentUserId) return;
    void pushAllProgress(currentUserId);
  });

  subscribeGamification(() => {
    if (syncing || !currentUserId) return;
    void pushGamification(currentUserId);
  });

  subscribeReviewSchedule(() => {
    if (syncing || !currentUserId) return;
    void pushReviewSchedule(currentUserId);
  });
}

// Re-exported only so callers don't need to know the internal row shape.
export type { TopicProgress };

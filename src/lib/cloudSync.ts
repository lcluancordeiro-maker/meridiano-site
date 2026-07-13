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
  type GamificationState,
} from "./gamification";
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
  unlocked_badges: string[];
  completed_topics: string[];
  xp_log: Record<string, number>;
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
    unlocked_badges: state.unlockedBadges,
    completed_topics: state.completedTopics,
    xp_log: state.xpLog,
  });
}

/** Pulls cloud state on login. If the account has no cloud data yet (first
 * login on any device), the current local/guest progress is pushed up
 * instead, so nothing earned before signing in is lost. Otherwise the cloud
 * is treated as the source of truth and overwrites local state. */
async function syncOnLogin(userId: string) {
  if (!supabase) return;
  syncing = true;
  try {
    const [{ data: progressRows }, { data: gamificationRow }] = await Promise.all([
      supabase.from("topic_progress").select("*").eq("user_id", userId),
      supabase.from("gamification_state").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    const hasCloudData = (progressRows && progressRows.length > 0) || !!gamificationRow;

    if (!hasCloudData) {
      await Promise.all([pushAllProgress(userId), pushGamification(userId)]);
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
        },
        unlockedBadges: row.unlocked_badges ?? [],
        completedTopics: row.completed_topics ?? [],
        xpLog: row.xp_log ?? {},
      };
      hydrateFromCloud(hydrated);
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
}

// Re-exported only so callers don't need to know the internal row shape.
export type { TopicProgress };

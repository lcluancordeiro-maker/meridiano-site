"use client";

import { useSyncExternalStore } from "react";
import {
  getGamificationSnapshot,
  subscribeGamification,
  type GamificationState,
} from "./gamification";

const SERVER_SNAPSHOT: GamificationState = {
  xp: 0,
  streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
  unlockedBadges: [],
  completedTopics: [],
  xpLog: {},
  gems: 0,
  xpBoostUntil: null,
  unlockedAccentThemes: [],
};

function getServerSnapshot(): GamificationState {
  return SERVER_SNAPSHOT;
}

export function useGamification(): GamificationState {
  return useSyncExternalStore(subscribeGamification, getGamificationSnapshot, getServerSnapshot);
}

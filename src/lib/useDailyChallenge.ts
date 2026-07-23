"use client";

import { useSyncExternalStore } from "react";
import {
  getDailyChallenge,
  getDailyChallengeStateSnapshot,
  subscribeDailyChallengeState,
  type DailyChallengeProblem,
  type DailyChallengeState,
} from "./dailyChallenge";

type DailyChallengeSnapshot = {
  problem: DailyChallengeProblem | null;
  state: DailyChallengeState;
};

const SERVER_STATE: DailyChallengeState = { current: 0, longest: 0, lastActiveDate: null, history: {} };
const SERVER_SNAPSHOT: DailyChallengeSnapshot = { problem: null, state: SERVER_STATE };

let combinedCache: DailyChallengeSnapshot | null = null;

function getSnapshot(): DailyChallengeSnapshot {
  const problem = getDailyChallenge();
  const state = getDailyChallengeStateSnapshot();
  if (combinedCache && combinedCache.problem === problem && combinedCache.state === state) {
    return combinedCache;
  }
  combinedCache = { problem, state };
  return combinedCache;
}

function getServerSnapshot(): DailyChallengeSnapshot {
  return SERVER_SNAPSHOT;
}

export function useDailyChallenge(): DailyChallengeSnapshot {
  return useSyncExternalStore(subscribeDailyChallengeState, getSnapshot, getServerSnapshot);
}

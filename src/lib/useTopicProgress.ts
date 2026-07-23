"use client";

import { useSyncExternalStore } from "react";
import {
  getTopicProgressSnapshot,
  subscribeProgress,
  type TopicProgress,
} from "./progress";
import type { Difficulty } from "@/data/curriculum";

function getServerSnapshot(): TopicProgress | undefined {
  return undefined;
}

export function useTopicProgress(
  levelId: string,
  topicId: string,
  difficulty: Difficulty
): TopicProgress | undefined {
  return useSyncExternalStore(
    subscribeProgress,
    () => getTopicProgressSnapshot(levelId, topicId, difficulty),
    getServerSnapshot
  );
}

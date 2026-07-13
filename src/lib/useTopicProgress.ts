"use client";

import { useSyncExternalStore } from "react";
import {
  getTopicProgressSnapshot,
  subscribeProgress,
  type TopicProgress,
} from "./progress";

function getServerSnapshot(): TopicProgress | undefined {
  return undefined;
}

export function useTopicProgress(
  levelId: string,
  topicId: string
): TopicProgress | undefined {
  return useSyncExternalStore(
    subscribeProgress,
    () => getTopicProgressSnapshot(levelId, topicId),
    getServerSnapshot
  );
}

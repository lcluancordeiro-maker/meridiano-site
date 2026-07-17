"use client";

import { useEffect, useState } from "react";
import { getTopicProgressSnapshot, subscribeProgress } from "./progress";
import { DIFFICULTY_ORDER } from "@/data/curriculum";

function computeCompleted(levelId: string, topicIds: string[]): number {
  let completed = 0;
  for (const topicId of topicIds) {
    for (const difficulty of DIFFICULTY_ORDER) {
      if (getTopicProgressSnapshot(levelId, topicId, difficulty)?.completed) completed++;
    }
  }
  return completed;
}

/** Rolls up completion across every difficulty tier of every topic in a
 * chapter — used by SkillPath to show "n/total" and a chapter-complete
 * state. Not built on useTopicProgress/useSyncExternalStore: the result is
 * a freshly computed number on every read, and useSyncExternalStore
 * requires a referentially stable snapshot, so this recomputes instead in
 * a plain progress subscription (the useState initializer covers the
 * mount-time value; topicIds is expected to be a stable reference — a
 * chapter's own array literal from curriculum.ts — so it's safe as an
 * effect dependency without needing to resync on every render). */
export function useChapterCompletion(
  levelId: string,
  topicIds: string[]
): { completed: number; total: number } {
  const total = topicIds.length * DIFFICULTY_ORDER.length;
  const [completed, setCompleted] = useState(() => computeCompleted(levelId, topicIds));

  useEffect(() => {
    return subscribeProgress(() => setCompleted(computeCompleted(levelId, topicIds)));
  }, [levelId, topicIds]);

  return { completed, total };
}

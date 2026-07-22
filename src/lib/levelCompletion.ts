import { DIFFICULTY_ORDER, type Topic } from "@/data/curriculum";
import type { ProgressStore } from "./progress";

/** A level counts as complete once every topic has all four difficulty
 * tiers marked completed — the same definition SkillPath.tsx already uses
 * per-topic (✓ node), just rolled up across the whole level. Used to
 * decide whether to offer a downloadable completion certificate. */
export function isLevelComplete(levelId: string, topics: Topic[], allProgress: ProgressStore): boolean {
  if (topics.length === 0) return false;
  return topics.every((topic) =>
    DIFFICULTY_ORDER.every((difficulty) => allProgress[`${levelId}/${topic.id}/${difficulty}`]?.completed)
  );
}

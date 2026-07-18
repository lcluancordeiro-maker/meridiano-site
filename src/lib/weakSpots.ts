import { DIFFICULTY_ORDER, getTopicsForLevel, levels } from "@/data/curriculum";
import type { ProgressStore } from "./progress";

export type WeakSpot = {
  levelId: string;
  topicId: string;
  levelName: string;
  topicTitle: string;
  score: number;
  total: number;
  accuracy: number;
};

/** Ranks every topic the student has actually attempted (score/total
 * summed across all difficulty tiers) by accuracy, ascending, so the
 * lowest-accuracy ones surface first. A topic only counts once it has at
 * least `minAttempts` graded exercises — otherwise a single unlucky guess
 * on a brand-new topic would outrank topics the student has genuinely
 * struggled with over many tries. */
export function getWeakSpots(
  allProgress: ProgressStore,
  { minAttempts = 3, limit = 5 }: { minAttempts?: number; limit?: number } = {}
): WeakSpot[] {
  const spots: WeakSpot[] = [];

  for (const level of levels) {
    for (const topic of getTopicsForLevel(level.id)) {
      let score = 0;
      let total = 0;
      for (const difficulty of DIFFICULTY_ORDER) {
        const p = allProgress[`${level.id}/${topic.id}/${difficulty}`];
        if (p) {
          score += p.score;
          total += p.total;
        }
      }
      if (total > 0 && total >= minAttempts) {
        spots.push({
          levelId: level.id,
          topicId: topic.id,
          levelName: level.shortName,
          topicTitle: topic.title,
          score,
          total,
          accuracy: score / total,
        });
      }
    }
  }

  spots.sort((a, b) => a.accuracy - b.accuracy || a.total - b.total);
  return spots.slice(0, limit);
}

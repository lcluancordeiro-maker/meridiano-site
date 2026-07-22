import { DIFFICULTY_ORDER, getTopicsForLevel, levels, type Difficulty } from "@/data/curriculum";
import type { ProgressStore } from "./progress";
import { getRecommendedDifficulty } from "./adaptiveDifficulty";

const MASTERY_THRESHOLD = 0.7;

export type RecommendationKind = "revisao" | "dificuldade" | "proximo-topico";

export type Recommendation = {
  kind: RecommendationKind;
  levelId: string;
  topicId: string;
  levelName: string;
  topicTitle: string;
  difficulty: Difficulty;
};

export type DueReview = { levelId: string; topicId: string; difficulty: Difficulty; dueAt: number };

/** Merges the three systems a student otherwise has to check
 * separately — spaced-repetition reviews that are due, adaptive-difficulty
 * suggestions on topics already started, and the next not-yet-started
 * topic on a track the student is already working through — into a single
 * ranked "recomendado para você" list, so there's one thing to look at
 * instead of three.
 *
 * Priority: overdue reviews first (the forgetting curve makes these the
 * most time-sensitive), then unmastered started topics, then fresh
 * ground. Deduped by (level, topic, difficulty) so the same suggestion
 * never appears twice even when more than one system would surface it. */
export function buildRecommendations(
  dueReviews: DueReview[],
  allProgress: ProgressStore,
  { limit = 5 }: { limit?: number } = {}
): Recommendation[] {
  const seen = new Set<string>();
  const results: Recommendation[] = [];

  function levelName(levelId: string): string {
    return levels.find((l) => l.id === levelId)?.shortName ?? levelId;
  }

  function topicTitle(levelId: string, topicId: string): string {
    return getTopicsForLevel(levelId).find((t) => t.id === topicId)?.title ?? topicId;
  }

  function push(kind: RecommendationKind, levelId: string, topicId: string, difficulty: Difficulty) {
    const key = `${levelId}/${topicId}/${difficulty}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ kind, levelId, topicId, difficulty, levelName: levelName(levelId), topicTitle: topicTitle(levelId, topicId) });
  }

  for (const review of [...dueReviews].sort((a, b) => a.dueAt - b.dueAt)) {
    push("revisao", review.levelId, review.topicId, review.difficulty);
  }

  for (const level of levels) {
    for (const topic of getTopicsForLevel(level.id)) {
      const progressByDifficulty: Partial<Record<Difficulty, { score: number; total: number }>> = {};
      let attempted = false;
      for (const difficulty of DIFFICULTY_ORDER) {
        const p = allProgress[`${level.id}/${topic.id}/${difficulty}`];
        if (p && p.total > 0) {
          attempted = true;
          progressByDifficulty[difficulty] = { score: p.score, total: p.total };
        }
      }
      if (!attempted) continue;

      const recommended = getRecommendedDifficulty(progressByDifficulty);
      const recommendedProgress = progressByDifficulty[recommended];
      const mastered =
        recommendedProgress !== undefined &&
        recommendedProgress.total > 0 &&
        recommendedProgress.score / recommendedProgress.total >= MASTERY_THRESHOLD;
      if (mastered) continue;

      push("dificuldade", level.id, topic.id, recommended);
    }
  }

  for (const level of levels) {
    const topics = getTopicsForLevel(level.id);
    let hasAnyProgress = false;
    let nextTopicId: string | undefined;

    for (const topic of topics) {
      const attemptedThisTopic = DIFFICULTY_ORDER.some(
        (d) => (allProgress[`${level.id}/${topic.id}/${d}`]?.total ?? 0) > 0
      );
      if (attemptedThisTopic) {
        hasAnyProgress = true;
      } else if (!nextTopicId) {
        nextTopicId = topic.id;
      }
    }

    if (hasAnyProgress && nextTopicId) {
      push("proximo-topico", level.id, nextTopicId, "facil");
    }
  }

  return results.slice(0, limit);
}

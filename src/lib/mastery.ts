import { DIFFICULTY_ORDER, type Difficulty } from "@/data/curriculum";

export type MasteryInput = Partial<
  Record<Difficulty, { score: number; total: number; updatedAt: number }>
>;

// Harder tiers count for more — acing "olimpiada" says more about mastery
// of a topic than acing "facil", so a flat sum across tiers would
// undersell it.
const TIER_WEIGHT: Record<Difficulty, number> = {
  facil: 1,
  medio: 2,
  dificil: 3,
  olimpiada: 4,
};

const RECENCY_FULL_DAYS = 14;
const RECENCY_FLOOR_DAYS = 90;
const RECENCY_FLOOR = 0.5;

// Practice within the last two weeks counts at full weight; from there it
// decays linearly down to a floor of 50% by the 90-day mark and never goes
// lower — a topic mastered a while ago still carries real signal, unlike a
// topic that was never attempted.
function recencyMultiplier(daysSinceLastPractice: number): number {
  if (daysSinceLastPractice <= RECENCY_FULL_DAYS) return 1;
  if (daysSinceLastPractice >= RECENCY_FLOOR_DAYS) return RECENCY_FLOOR;
  const span = RECENCY_FLOOR_DAYS - RECENCY_FULL_DAYS;
  const progress = (daysSinceLastPractice - RECENCY_FULL_DAYS) / span;
  return 1 - progress * (1 - RECENCY_FLOOR);
}

/**
 * Unified 0-100 mastery score for a single topic, blending accuracy
 * (weighted toward harder difficulty tiers) with recency (stale practice
 * is discounted, never zeroed out). Returns null when the topic has no
 * recorded attempts at any tier yet.
 */
export function computeTopicMastery(progress: MasteryInput, now: number = Date.now()): number | null {
  let weightedScore = 0;
  let weightedTotal = 0;
  let mostRecentUpdatedAt = 0;

  for (const difficulty of DIFFICULTY_ORDER) {
    const entry = progress[difficulty];
    if (!entry || entry.total === 0) continue;
    const weight = TIER_WEIGHT[difficulty];
    weightedScore += entry.score * weight;
    weightedTotal += entry.total * weight;
    mostRecentUpdatedAt = Math.max(mostRecentUpdatedAt, entry.updatedAt);
  }

  if (weightedTotal === 0) return null;

  const accuracy = weightedScore / weightedTotal;
  const daysSince = (now - mostRecentUpdatedAt) / (1000 * 60 * 60 * 24);
  const recency = recencyMultiplier(daysSince);

  return Math.round(accuracy * recency * 100);
}

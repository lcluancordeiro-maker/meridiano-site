import { DIFFICULTY_ORDER, type Difficulty } from "@/data/curriculum";

export type DifficultyProgressSummary = { score: number; total: number };

/** Same 70% bar ExerciseQuiz's result screen uses for "Muito bem!" — a tier
 * counts as mastered once the student clears it, not just attempts it. */
const MASTERY_THRESHOLD = 0.7;

/** Suggests which difficulty tier to practice next for a topic, from the
 * student's own recorded progress on that topic: the first tier that either
 * hasn't been attempted yet, or was attempted below the mastery bar. If every
 * tier has been mastered, keeps recommending the hardest one so the student
 * stays sharp instead of getting no further suggestion. */
export function getRecommendedDifficulty(
  progressByDifficulty: Partial<Record<Difficulty, DifficultyProgressSummary>>
): Difficulty {
  for (const difficulty of DIFFICULTY_ORDER) {
    const progress = progressByDifficulty[difficulty];
    if (!progress || progress.total <= 0) return difficulty;
    if (progress.score / progress.total < MASTERY_THRESHOLD) return difficulty;
  }
  return DIFFICULTY_ORDER[DIFFICULTY_ORDER.length - 1];
}

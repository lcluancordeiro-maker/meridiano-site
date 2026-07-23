import type { Difficulty, Topic } from "@/data/curriculum";

/** How many of a track's earliest topics get spot-checked — enough to find
 * where a student's competence actually starts, without turning "just tell
 * me where to begin" into a long test. */
const SAMPLE_TOPIC_COUNT = 4;
const SAMPLE_DIFFICULTIES: Difficulty[] = ["facil", "medio"];

export type DiagnosticQuestion = {
  topicId: string;
  topicTitle: string;
  difficulty: Difficulty;
  exerciseId: string;
  prompt: string;
  type: "multiple-choice" | "numeric";
  options?: string[];
  answer: string;
};

/** One "fácil" + one "médio" question from each of the track's first
 * `SAMPLE_TOPIC_COUNT` topics (curriculum order = intended learning order,
 * so early topics are the right ones to spot-check) — every topic
 * guarantees at least one exercise per tier (curriculum.test.ts enforces
 * this), so there's always something to sample. */
export function buildDiagnosticQuestions(topics: Topic[]): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];
  for (const topic of topics.slice(0, SAMPLE_TOPIC_COUNT)) {
    for (const difficulty of SAMPLE_DIFFICULTIES) {
      const exercise = topic.exercises.find((e) => e.difficulty === difficulty);
      if (!exercise) continue;
      questions.push({
        topicId: topic.id,
        topicTitle: topic.title,
        difficulty,
        exerciseId: exercise.id,
        prompt: exercise.prompt,
        type: exercise.type,
        options: exercise.options,
        answer: exercise.answer,
      });
    }
  }
  return questions;
}

export type DiagnosticAnswer = { topicId: string; difficulty: Difficulty; correct: boolean };

export type DiagnosticPlacement = { topicId: string; topicTitle: string; difficulty: Difficulty };

/** Finds the "frontier" of the student's competence: the first sampled
 * topic where they missed the easy question (start there, fácil), or
 * missed the médio one after passing fácil (start there, médio). If every
 * sampled topic was answered correctly, recommends skipping straight to
 * the topic right after the sample (fácil) — or, if the sample already
 * covered the whole track, the last topic at dificil, so a strong student
 * isn't just told to redo what they already breezed through.
 *
 * Precondition: `topics` is non-empty (every real track has topics; the
 * page only reaches this with a track picked from the curriculum). */
export function computePlacement(topics: Topic[], answers: DiagnosticAnswer[]): DiagnosticPlacement {
  const sampled = topics.slice(0, SAMPLE_TOPIC_COUNT);
  for (const topic of sampled) {
    const facil = answers.find((a) => a.topicId === topic.id && a.difficulty === "facil");
    if (facil && !facil.correct) return { topicId: topic.id, topicTitle: topic.title, difficulty: "facil" };
    const medio = answers.find((a) => a.topicId === topic.id && a.difficulty === "medio");
    if (medio && !medio.correct) return { topicId: topic.id, topicTitle: topic.title, difficulty: "medio" };
  }
  const next = topics[sampled.length];
  if (next) return { topicId: next.id, topicTitle: next.title, difficulty: "facil" };
  const last = sampled[sampled.length - 1];
  return { topicId: last.id, topicTitle: last.title, difficulty: "dificil" };
}

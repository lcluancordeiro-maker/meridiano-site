import { describe, expect, it } from "vitest";
import { buildDiagnosticQuestions, computePlacement } from "./diagnostic";
import type { Topic } from "@/data/curriculum";

function topic(id: string, difficulties: Array<"facil" | "medio" | "dificil" | "olimpiada">): Topic {
  return {
    id,
    title: `Título ${id}`,
    summary: "",
    minutes: 5,
    theory: [],
    exercises: difficulties.map((difficulty) => ({
      id: `${id}-${difficulty}`,
      prompt: `Pergunta ${id} ${difficulty}`,
      type: "numeric",
      difficulty,
      answer: "1",
      explanation: "",
    })),
  };
}

const ALL_TIERS: Array<"facil" | "medio" | "dificil" | "olimpiada"> = ["facil", "medio", "dificil", "olimpiada"];

describe("buildDiagnosticQuestions", () => {
  it("samples one fácil + one médio question from each of the first 4 topics", () => {
    const topics = ["a", "b", "c", "d", "e"].map((id) => topic(id, ALL_TIERS));
    const questions = buildDiagnosticQuestions(topics);
    expect(questions).toHaveLength(8);
    expect(questions.map((q) => q.topicId)).toEqual(["a", "a", "b", "b", "c", "c", "d", "d"]);
    expect(questions.map((q) => q.difficulty)).toEqual([
      "facil", "medio", "facil", "medio", "facil", "medio", "facil", "medio",
    ]);
  });

  it("uses fewer questions for a track with fewer than 4 topics", () => {
    const topics = ["a", "b"].map((id) => topic(id, ALL_TIERS));
    expect(buildDiagnosticQuestions(topics)).toHaveLength(4);
  });

  it("skips a tier a topic doesn't have an exercise for", () => {
    const topics = [topic("a", ["facil"])];
    const questions = buildDiagnosticQuestions(topics);
    expect(questions).toHaveLength(1);
    expect(questions[0].difficulty).toBe("facil");
  });
});

describe("computePlacement", () => {
  const topics = ["a", "b", "c", "d", "e"].map((id) => topic(id, ALL_TIERS));

  it("places at fácil on the first topic where the fácil question is wrong", () => {
    const placement = computePlacement(topics, [
      { topicId: "a", difficulty: "facil", correct: true },
      { topicId: "a", difficulty: "medio", correct: true },
      { topicId: "b", difficulty: "facil", correct: false },
      { topicId: "b", difficulty: "medio", correct: true },
    ]);
    expect(placement).toEqual({ topicId: "b", topicTitle: "Título b", difficulty: "facil" });
  });

  it("places at médio when fácil passes but médio fails", () => {
    const placement = computePlacement(topics, [
      { topicId: "a", difficulty: "facil", correct: true },
      { topicId: "a", difficulty: "medio", correct: false },
    ]);
    expect(placement).toEqual({ topicId: "a", topicTitle: "Título a", difficulty: "medio" });
  });

  it("recommends the topic right after the sample when every sampled topic is correct", () => {
    const answers = ["a", "b", "c", "d"].flatMap((id) => [
      { topicId: id, difficulty: "facil" as const, correct: true },
      { topicId: id, difficulty: "medio" as const, correct: true },
    ]);
    const placement = computePlacement(topics, answers);
    expect(placement).toEqual({ topicId: "e", topicTitle: "Título e", difficulty: "facil" });
  });

  it("recommends the last sampled topic at dificil when the sample covers the whole track", () => {
    const shortTrack = ["a", "b"].map((id) => topic(id, ALL_TIERS));
    const answers = ["a", "b"].flatMap((id) => [
      { topicId: id, difficulty: "facil" as const, correct: true },
      { topicId: id, difficulty: "medio" as const, correct: true },
    ]);
    const placement = computePlacement(shortTrack, answers);
    expect(placement).toEqual({ topicId: "b", topicTitle: "Título b", difficulty: "dificil" });
  });

  it("stops at the first miss even if a later sampled topic was also answered", () => {
    const placement = computePlacement(topics, [
      { topicId: "a", difficulty: "facil", correct: false },
      { topicId: "b", difficulty: "facil", correct: true },
      { topicId: "b", difficulty: "medio", correct: true },
    ]);
    expect(placement).toEqual({ topicId: "a", topicTitle: "Título a", difficulty: "facil" });
  });
});

import { describe, expect, it } from "vitest";
import { buildRecommendations } from "@/lib/unifiedRecommendations";
import type { ProgressStore } from "@/lib/progress";

describe("buildRecommendations", () => {
  it("returns nothing when there's no data at all", () => {
    expect(buildRecommendations([], {})).toEqual([]);
  });

  it("puts due reviews first, earliest due first", () => {
    const result = buildRecommendations(
      [
        { levelId: "fundamental-2", topicId: "fracoes", difficulty: "facil", dueAt: 200 },
        { levelId: "fundamental-2", topicId: "numeros-inteiros", difficulty: "facil", dueAt: 100 },
      ],
      {}
    );
    expect(result[0]).toMatchObject({ kind: "revisao", topicId: "numeros-inteiros" });
    expect(result[1]).toMatchObject({ kind: "revisao", topicId: "fracoes" });
  });

  it("suggests an adaptive-difficulty tier for a started, unmastered topic", () => {
    const progress: ProgressStore = {
      "fundamental-2/fracoes/facil": { completed: true, score: 3, total: 10, updatedAt: 0 },
    };
    const result = buildRecommendations([], progress);
    expect(result).toContainEqual(
      expect.objectContaining({ kind: "dificuldade", levelId: "fundamental-2", topicId: "fracoes", difficulty: "facil" })
    );
  });

  it("doesn't suggest a topic whose recommended tier is already mastered", () => {
    // Fully mastering every tier of "fracoes" means adaptiveDifficulty keeps
    // recommending the hardest tier — mastered too, so nothing to suggest.
    const progress: ProgressStore = {
      "fundamental-2/fracoes/facil": { completed: true, score: 10, total: 10, updatedAt: 0 },
      "fundamental-2/fracoes/medio": { completed: true, score: 10, total: 10, updatedAt: 0 },
      "fundamental-2/fracoes/dificil": { completed: true, score: 10, total: 10, updatedAt: 0 },
      "fundamental-2/fracoes/olimpiada": { completed: true, score: 10, total: 10, updatedAt: 0 },
    };
    const result = buildRecommendations([], progress);
    expect(result.find((r) => r.topicId === "fracoes")).toBeUndefined();
  });

  it("suggests the next not-started topic on a track already in progress", () => {
    const progress: ProgressStore = {
      "fundamental-2/numeros-inteiros/facil": { completed: true, score: 10, total: 10, updatedAt: 0 },
    };
    const result = buildRecommendations([], progress);
    const next = result.find((r) => r.kind === "proximo-topico" && r.levelId === "fundamental-2");
    expect(next).toBeDefined();
    expect(next?.topicId).not.toBe("numeros-inteiros");
  });

  it("never suggests a next-topic for a track with zero progress at all", () => {
    const result = buildRecommendations([], {});
    expect(result.find((r) => r.kind === "proximo-topico")).toBeUndefined();
  });

  it("dedupes across systems: a review-due item isn't repeated as an adaptive suggestion", () => {
    const progress: ProgressStore = {
      "fundamental-2/fracoes/facil": { completed: true, score: 3, total: 10, updatedAt: 0 },
    };
    const result = buildRecommendations(
      [{ levelId: "fundamental-2", topicId: "fracoes", difficulty: "facil", dueAt: 100 }],
      progress
    );
    const matches = result.filter((r) => r.levelId === "fundamental-2" && r.topicId === "fracoes" && r.difficulty === "facil");
    expect(matches).toHaveLength(1);
    expect(matches[0].kind).toBe("revisao");
  });

  it("respects the limit option", () => {
    const dueReviews = Array.from({ length: 10 }, (_, i) => ({
      levelId: "fundamental-2",
      topicId: "fracoes",
      difficulty: "facil" as const,
      dueAt: i,
    }));
    // Only one of these survives dedupe (same key), so bump distinct topics instead.
    const uniqueReviews = [
      { levelId: "fundamental-2", topicId: "fracoes", difficulty: "facil" as const, dueAt: 1 },
      { levelId: "fundamental-2", topicId: "numeros-inteiros", difficulty: "facil" as const, dueAt: 2 },
      { levelId: "medio", topicId: "funcao-primeiro-grau", difficulty: "facil" as const, dueAt: 3 },
    ];
    expect(buildRecommendations(dueReviews, {}, { limit: 1 })).toHaveLength(1);
    expect(buildRecommendations(uniqueReviews, {}, { limit: 2 })).toHaveLength(2);
  });
});

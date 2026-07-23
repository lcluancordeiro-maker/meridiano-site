import { describe, expect, it } from "vitest";
import { isLevelComplete } from "@/lib/levelCompletion";
import type { Topic } from "@/data/curriculum";
import type { ProgressStore } from "@/lib/progress";

function topic(id: string): Topic {
  return { id, title: id, summary: "", minutes: 5, theory: [], exercises: [] };
}

function progress(completed: boolean) {
  return { completed, score: 1, total: 1, updatedAt: 0 };
}

describe("isLevelComplete", () => {
  it("is false for a level with no topics", () => {
    expect(isLevelComplete("nivel", [], {})).toBe(false);
  });

  it("is false when no progress exists at all", () => {
    expect(isLevelComplete("nivel", [topic("a")], {})).toBe(false);
  });

  it("is false when only some difficulty tiers of a topic are completed", () => {
    const store: ProgressStore = {
      "nivel/a/facil": progress(true),
      "nivel/a/medio": progress(true),
    };
    expect(isLevelComplete("nivel", [topic("a")], store)).toBe(false);
  });

  it("is true when every topic has all four tiers completed", () => {
    const store: ProgressStore = {
      "nivel/a/facil": progress(true),
      "nivel/a/medio": progress(true),
      "nivel/a/dificil": progress(true),
      "nivel/a/olimpiada": progress(true),
      "nivel/b/facil": progress(true),
      "nivel/b/medio": progress(true),
      "nivel/b/dificil": progress(true),
      "nivel/b/olimpiada": progress(true),
    };
    expect(isLevelComplete("nivel", [topic("a"), topic("b")], store)).toBe(true);
  });

  it("is false when one of several topics is missing a tier", () => {
    const store: ProgressStore = {
      "nivel/a/facil": progress(true),
      "nivel/a/medio": progress(true),
      "nivel/a/dificil": progress(true),
      "nivel/a/olimpiada": progress(true),
      "nivel/b/facil": progress(true),
    };
    expect(isLevelComplete("nivel", [topic("a"), topic("b")], store)).toBe(false);
  });
});

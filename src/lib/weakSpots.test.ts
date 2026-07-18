import { describe, expect, it } from "vitest";
import { getWeakSpots } from "./weakSpots";
import type { ProgressStore } from "./progress";

function progress(score: number, total: number) {
  return { completed: true, score, total, updatedAt: Date.now() };
}

describe("getWeakSpots", () => {
  it("returns nothing when there's no progress at all", () => {
    expect(getWeakSpots({})).toEqual([]);
  });

  it("ignores a topic below the minimum attempt threshold", () => {
    const store: ProgressStore = {
      "fundamental-2/fracoes/facil": progress(0, 2), // 2 attempts, default min is 3
    };
    expect(getWeakSpots(store)).toEqual([]);
  });

  it("sums score/total across every difficulty tier of the same topic", () => {
    const store: ProgressStore = {
      "fundamental-2/fracoes/facil": progress(4, 5),
      "fundamental-2/fracoes/medio": progress(2, 5),
    };
    const [spot] = getWeakSpots(store);
    expect(spot).toMatchObject({
      levelId: "fundamental-2",
      topicId: "fracoes",
      score: 6,
      total: 10,
      accuracy: 0.6,
    });
  });

  it("ranks the lowest-accuracy topic first", () => {
    const store: ProgressStore = {
      "fundamental-2/fracoes/facil": progress(6, 6), // 100%
      "fundamental-2/geometria-plana/facil": progress(1, 6), // ~17%
      "medio/funcao-primeiro-grau/facil": progress(3, 6), // 50%
    };
    const spots = getWeakSpots(store);
    expect(spots.map((s) => s.topicId)).toEqual([
      "geometria-plana",
      "funcao-primeiro-grau",
      "fracoes",
    ]);
  });

  it("respects a custom limit", () => {
    const store: ProgressStore = {
      "fundamental-2/fracoes/facil": progress(1, 6),
      "fundamental-2/geometria-plana/facil": progress(1, 6),
      "medio/funcao-primeiro-grau/facil": progress(1, 6),
    };
    expect(getWeakSpots(store, { limit: 2 })).toHaveLength(2);
  });

  it("breaks an accuracy tie by fewer attempts first (less-practiced topic surfaces first)", () => {
    const store: ProgressStore = {
      "fundamental-2/fracoes/facil": progress(3, 6), // 50%, 6 attempts
      "fundamental-2/geometria-plana/facil": progress(2, 4), // 50%, 4 attempts
    };
    const spots = getWeakSpots(store);
    expect(spots[0].topicId).toBe("geometria-plana");
  });

  it("a topic with zero graded exercises never appears even with a low minAttempts", () => {
    const store: ProgressStore = {};
    expect(getWeakSpots(store, { minAttempts: 0 })).toEqual([]);
  });
});

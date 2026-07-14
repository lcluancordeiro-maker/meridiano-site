import { describe, expect, it } from "vitest";
import { getRecommendedDifficulty } from "./adaptiveDifficulty";

describe("getRecommendedDifficulty", () => {
  it("recommends facil when nothing has been attempted yet", () => {
    expect(getRecommendedDifficulty({})).toBe("facil");
  });

  it("recommends the next tier after facil is mastered", () => {
    expect(getRecommendedDifficulty({ facil: { score: 5, total: 5 } })).toBe("medio");
  });

  it("recommends re-attempting a tier that was attempted below the mastery bar", () => {
    expect(getRecommendedDifficulty({ facil: { score: 2, total: 5 } })).toBe("facil");
  });

  it("treats exactly 70% as mastered (moves on)", () => {
    expect(getRecommendedDifficulty({ facil: { score: 7, total: 10 } })).toBe("medio");
  });

  it("treats just under 70% as not mastered (stays)", () => {
    expect(getRecommendedDifficulty({ facil: { score: 6, total: 10 } })).toBe("facil");
  });

  it("skips ahead past every mastered tier to the first weak or untried one", () => {
    const result = getRecommendedDifficulty({
      facil: { score: 5, total: 5 },
      medio: { score: 5, total: 5 },
      dificil: { score: 1, total: 5 },
    });
    expect(result).toBe("dificil");
  });

  it("recommends olimpiada once every tier is mastered", () => {
    const result = getRecommendedDifficulty({
      facil: { score: 5, total: 5 },
      medio: { score: 5, total: 5 },
      dificil: { score: 5, total: 5 },
      olimpiada: { score: 5, total: 5 },
    });
    expect(result).toBe("olimpiada");
  });

  it("treats a recorded-but-empty tier (total 0) as not yet attempted", () => {
    expect(getRecommendedDifficulty({ facil: { score: 0, total: 0 } })).toBe("facil");
  });
});

import { describe, expect, it } from "vitest";
import { computeTopicMastery } from "./mastery";

const DAY = 1000 * 60 * 60 * 24;
const NOW = Date.UTC(2026, 0, 1);

describe("computeTopicMastery", () => {
  it("returns null when no tier has been attempted", () => {
    expect(computeTopicMastery({}, NOW)).toBeNull();
  });

  it("returns 100 for a perfect, recent score on a single tier", () => {
    const result = computeTopicMastery(
      { facil: { score: 6, total: 6, updatedAt: NOW } },
      NOW
    );
    expect(result).toBe(100);
  });

  it("weights harder tiers more than easier ones", () => {
    // Same 50% accuracy on each tier alone, but olimpiada (weight 4) pulls
    // the blended score further from 50 than facil (weight 1) would when
    // mixed with a perfect facil result.
    const easyOnly = computeTopicMastery(
      { facil: { score: 3, total: 6, updatedAt: NOW } },
      NOW
    );
    const mixed = computeTopicMastery(
      {
        facil: { score: 6, total: 6, updatedAt: NOW },
        olimpiada: { score: 0, total: 6, updatedAt: NOW },
      },
      NOW
    );
    expect(easyOnly).toBe(50);
    // weighted: (6*1 + 0*4) / (6*1 + 6*4) = 6/30 = 20%
    expect(mixed).toBe(20);
  });

  it("keeps full weight for practice within the last 14 days", () => {
    const result = computeTopicMastery(
      { facil: { score: 6, total: 6, updatedAt: NOW - 10 * DAY } },
      NOW
    );
    expect(result).toBe(100);
  });

  it("discounts stale practice but never below the 50% floor", () => {
    const at90Days = computeTopicMastery(
      { facil: { score: 6, total: 6, updatedAt: NOW - 90 * DAY } },
      NOW
    );
    const at365Days = computeTopicMastery(
      { facil: { score: 6, total: 6, updatedAt: NOW - 365 * DAY } },
      NOW
    );
    expect(at90Days).toBe(50);
    expect(at365Days).toBe(50);
  });

  it("uses the most recent tier's timestamp for recency, not the oldest", () => {
    const result = computeTopicMastery(
      {
        facil: { score: 6, total: 6, updatedAt: NOW - 365 * DAY },
        medio: { score: 6, total: 6, updatedAt: NOW },
      },
      NOW
    );
    expect(result).toBe(100);
  });

  it("ignores a tier with zero total (never attempted)", () => {
    const result = computeTopicMastery(
      {
        facil: { score: 6, total: 6, updatedAt: NOW },
        medio: { score: 0, total: 0, updatedAt: 0 },
      },
      NOW
    );
    expect(result).toBe(100);
  });
});

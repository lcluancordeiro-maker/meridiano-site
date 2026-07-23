import { describe, expect, it } from "vitest";
import { MATHEMATICIANS, getMathematician } from "./mathematicians";
import { getLevel, getTopic } from "./curriculum";

describe("mathematicians", () => {
  it("has unique ids", () => {
    const ids = MATHEMATICIANS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every figure has non-empty name, years, origin, tagline, portrait, bio and contributions", () => {
    for (const m of MATHEMATICIANS) {
      expect(m.name.trim(), `${m.id} name`).not.toBe("");
      expect(m.years.trim(), `${m.id} years`).not.toBe("");
      expect(m.origin.trim(), `${m.id} origin`).not.toBe("");
      expect(m.tagline.trim(), `${m.id} tagline`).not.toBe("");
      expect(m.portrait.trim(), `${m.id} portrait`).not.toBe("");
      expect(m.bio.length, `${m.id} bio`).toBeGreaterThanOrEqual(2);
      for (const paragraph of m.bio) {
        expect(paragraph.trim(), `${m.id} bio paragraph`).not.toBe("");
      }
      expect(m.contributions.length, `${m.id} contributions`).toBeGreaterThanOrEqual(2);
      for (const item of m.contributions) {
        expect(item.trim(), `${m.id} contribution`).not.toBe("");
      }
    }
  });

  it("every relatedTopics ref resolves to a real level and topic", () => {
    for (const m of MATHEMATICIANS) {
      for (const ref of m.relatedTopics ?? []) {
        expect(getLevel(ref.levelId), `${m.id} → level ${ref.levelId}`).toBeDefined();
        expect(
          getTopic(ref.levelId, ref.topicId),
          `${m.id} → topic ${ref.levelId}/${ref.topicId}`
        ).toBeDefined();
      }
    }
  });

  it("getMathematician resolves known ids and returns undefined for unknown ones", () => {
    expect(getMathematician("gauss")?.name).toBe("Carl Friedrich Gauss");
    expect(getMathematician("nao-existe")).toBeUndefined();
  });
});

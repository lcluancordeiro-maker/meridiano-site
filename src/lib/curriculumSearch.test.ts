import { describe, expect, it } from "vitest";
import { searchCurriculum } from "./curriculumSearch";

describe("searchCurriculum", () => {
  it("returns an empty list for an empty query", () => {
    expect(searchCurriculum("")).toEqual([]);
    expect(searchCurriculum("   ")).toEqual([]);
  });

  it("finds a topic by an exact title match", () => {
    const results = searchCurriculum("Frações");
    expect(results.some((r) => r.levelId === "fundamental-2" && r.topicId === "fracoes")).toBe(true);
  });

  it("is case- and accent-insensitive", () => {
    const results = searchCurriculum("fracoes");
    expect(results.some((r) => r.topicId === "fracoes")).toBe(true);
  });

  it("ranks title matches ahead of summary-only matches", () => {
    const results = searchCurriculum("regressão");
    const titleMatches = results.filter((r) => r.topicTitle.toLowerCase().includes("regressão"));
    const firstNonTitleIndex = results.findIndex(
      (r) => !r.topicTitle.toLowerCase().includes("regressão")
    );
    if (titleMatches.length > 0 && firstNonTitleIndex !== -1) {
      expect(firstNonTitleIndex).toBeGreaterThanOrEqual(titleMatches.length);
    }
  });

  it("flags premium tracks so the UI can badge them", () => {
    const results = searchCurriculum("regressão múltipla");
    const econometriaResult = results.find((r) => r.levelId === "econometria-iniciante");
    expect(econometriaResult?.levelPremium).toBe(true);
  });

  it("returns nothing for a query that matches no topic", () => {
    expect(searchCurriculum("xyzzyquantumnonsense")).toEqual([]);
  });

  it("caps results at 20", () => {
    // "a" appears in the title or summary of far more than 20 topics.
    const results = searchCurriculum("a");
    expect(results.length).toBeLessThanOrEqual(20);
  });
});

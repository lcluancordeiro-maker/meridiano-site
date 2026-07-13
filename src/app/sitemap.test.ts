import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { levels, getTopicsForLevel } from "@/data/curriculum";

describe("sitemap", () => {
  it("includes the home page and key static routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("http://localhost:3000");
    expect(urls).toContain("http://localhost:3000/calculadora");
    expect(urls).toContain("http://localhost:3000/privacidade");
  });

  it("includes a trilha URL and topic URLs for every available level", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const level of levels.filter((l) => l.available)) {
      expect(urls).toContain(`http://localhost:3000/trilha/${level.id}`);
      for (const topic of getTopicsForLevel(level.id)) {
        expect(urls).toContain(`http://localhost:3000/trilha/${level.id}/${topic.id}`);
      }
    }
  });

  it("excludes unavailable ('em breve') levels from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const level of levels.filter((l) => !l.available)) {
      expect(urls).not.toContain(`http://localhost:3000/trilha/${level.id}`);
    }
  });

  it("has no duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

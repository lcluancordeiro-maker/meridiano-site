import { describe, expect, it } from "vitest";
import { getLevel, getTopic, getRelatedTopics } from "@/data/curriculum";
import { buildPathway } from "./knowledgePathway";

function node(levelId: string, topicId: string) {
  const level = getLevel(levelId)!;
  const topic = getTopic(levelId, topicId)!;
  return { level, topic };
}

describe("buildPathway", () => {
  it("returns an empty array for a topic with no related topics", () => {
    const center = node("fundamental-2", "numeros-inteiros");
    expect(buildPathway(center, getRelatedTopics(center.topic))).toEqual([]);
  });

  it("returns one ring-1 entry per curated related topic", () => {
    const center = node("medio", "funcao-primeiro-grau");
    const ring1 = getRelatedTopics(center.topic);
    const pathway = buildPathway(center, ring1);
    expect(pathway.map((n) => n.topic.id).sort()).toEqual(
      ["funcao-quadratica", "geometria-analitica"].sort()
    );
  });

  it("spirals a second hop across tracks (Ensino Médio → Econometria → Machine Learning)", () => {
    const center = node("medio", "geometria-analitica");
    const ring1 = getRelatedTopics(center.topic);
    const pathway = buildPathway(center, ring1);

    const econometria = pathway.find((n) => n.topic.id === "regressao-linear-simples");
    expect(econometria).toBeDefined();
    expect(econometria!.children.map((c) => c.topic.id)).toContain(
      "fundamentos-aprendizado-supervisionado"
    );
  });

  it("never lists the center topic itself as a ring-2 child", () => {
    // funcao-primeiro-grau ←→ geometria-analitica reference each other, so
    // without the `seen` guard, geometria-analitica's ring-2 would include
    // funcao-primeiro-grau right back.
    const center = node("medio", "funcao-primeiro-grau");
    const ring1 = getRelatedTopics(center.topic);
    const pathway = buildPathway(center, ring1);

    for (const ring1Node of pathway) {
      const childIds = ring1Node.children.map((c) => c.topic.id);
      expect(childIds).not.toContain("funcao-primeiro-grau");
    }
  });

  it("never lists a ring-1 topic again as a ring-2 child under a sibling", () => {
    const center = node("medio", "funcao-primeiro-grau");
    const ring1 = getRelatedTopics(center.topic);
    const ring1Ids = new Set(ring1.map((n) => n.topic.id));
    const pathway = buildPathway(center, ring1);

    for (const ring1Node of pathway) {
      for (const child of ring1Node.children) {
        expect(ring1Ids.has(child.topic.id)).toBe(false);
      }
    }
  });

  it("never lists the same ring-2 topic twice across different ring-1 parents", () => {
    const center = node("medio", "geometria-analitica");
    const ring1 = getRelatedTopics(center.topic);
    const pathway = buildPathway(center, ring1);

    const allChildKeys = pathway.flatMap((n) =>
      n.children.map((c) => `${c.level.id}/${c.topic.id}`)
    );
    expect(new Set(allChildKeys).size).toBe(allChildKeys.length);
  });
});

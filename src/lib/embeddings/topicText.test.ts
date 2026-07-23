import { describe, expect, it } from "vitest";
import { hashEmbeddingText, topicToEmbeddingText } from "./topicText";
import type { Topic } from "@/data/curriculum";

const sampleTopic: Topic = {
  id: "sample",
  title: "Título de Exemplo",
  summary: "Um resumo curto.",
  minutes: 10,
  theory: [
    { heading: "Primeira seção", body: ["Primeiro parágrafo.", "Segundo parágrafo."] },
    { heading: "Segunda seção", body: ["Outro parágrafo."] },
  ],
  exercises: [],
};

describe("topicToEmbeddingText", () => {
  it("includes the title, summary and every theory heading/body", () => {
    const text = topicToEmbeddingText(sampleTopic);
    expect(text).toContain("Título de Exemplo");
    expect(text).toContain("Um resumo curto.");
    expect(text).toContain("Primeira seção");
    expect(text).toContain("Primeiro parágrafo. Segundo parágrafo.");
    expect(text).toContain("Segunda seção");
    expect(text).toContain("Outro parágrafo.");
  });

  it("does not include exercise content", () => {
    const withExercises: Topic = {
      ...sampleTopic,
      exercises: [
        { id: "e1", prompt: "SENTINEL_PROMPT", type: "numeric", difficulty: "facil", answer: "1", explanation: "x" },
      ],
    };
    expect(topicToEmbeddingText(withExercises)).not.toContain("SENTINEL_PROMPT");
  });
});

describe("hashEmbeddingText", () => {
  it("is stable for the same input", () => {
    expect(hashEmbeddingText("abc")).toBe(hashEmbeddingText("abc"));
  });

  it("differs for different input", () => {
    expect(hashEmbeddingText("abc")).not.toBe(hashEmbeddingText("abd"));
  });
});

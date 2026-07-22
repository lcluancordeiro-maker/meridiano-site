import { describe, expect, it } from "vitest";
import { buildTutorSystemPrompt } from "./systemPrompt";

describe("buildTutorSystemPrompt", () => {
  it("names the tutor Gauss and states the Socratic, no-direct-answers rule", () => {
    const prompt = buildTutorSystemPrompt();
    expect(prompt).toContain("Gauss");
    expect(prompt).toContain("Nunca dê a resposta final");
  });

  it("asks the student what they're studying when no context is given", () => {
    const prompt = buildTutorSystemPrompt();
    expect(prompt).toContain("pergunte antes de explicar");
  });

  it("includes the level and topic when context is provided", () => {
    const prompt = buildTutorSystemPrompt({ levelName: "Ensino Médio", topicTitle: "Função Quadrática" });
    expect(prompt).toContain("Ensino Médio — Função Quadrática");
  });

  it("includes just the level when only that is provided", () => {
    const prompt = buildTutorSystemPrompt({ levelName: "Ensino Fundamental II" });
    expect(prompt).toContain("O aluno está estudando: Ensino Fundamental II.");
  });

  it("defaults to guided mode: no direct-answer instruction, keeps the Socratic rule", () => {
    const prompt = buildTutorSystemPrompt();
    expect(prompt).toContain("Nunca dê a resposta final");
    expect(prompt).not.toContain("modo Direto");
  });

  it("in direto mode, drops the Socratic rule and instructs a full worked answer", () => {
    const prompt = buildTutorSystemPrompt(undefined, "pt-BR", "direto");
    expect(prompt).toContain("modo Direto");
    expect(prompt).toContain("Resolva o exercício por completo");
    expect(prompt).not.toContain("Nunca dê a resposta final");
  });
});

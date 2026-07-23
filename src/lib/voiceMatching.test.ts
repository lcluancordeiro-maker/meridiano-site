import { describe, expect, it } from "vitest";
import { extractSpokenNumber, matchSpokenOption } from "./voiceMatching";

describe("matchSpokenOption", () => {
  it("matches an exact (case/accent-insensitive) transcript", () => {
    expect(matchSpokenOption("verdadeiro", ["Verdadeiro", "Falso"])).toBe("Verdadeiro");
    expect(matchSpokenOption("Verdadeiro", ["Verdadeiro", "Falso"])).toBe("Verdadeiro");
  });

  it("matches when the transcript contains the option as a substring", () => {
    expect(matchSpokenOption("eu acho que é verdadeiro", ["Verdadeiro", "Falso"])).toBe("Verdadeiro");
  });

  it("matches when the option contains the (shorter) transcript", () => {
    expect(matchSpokenOption("antes", ["Antes", "Depois"])).toBe("Antes");
  });

  it("falls back to best word overlap for longer options", () => {
    const options = ["O primeiro que entrou (FIFO)", "O último que entrou (LIFO)"];
    expect(matchSpokenOption("o último que entrou", options)).toBe("O último que entrou (LIFO)");
  });

  it("returns null when nothing matches", () => {
    expect(matchSpokenOption("banana", ["Verdadeiro", "Falso"])).toBeNull();
  });

  it("returns null for an empty transcript", () => {
    expect(matchSpokenOption("   ", ["Verdadeiro", "Falso"])).toBeNull();
  });

  it("ignores accents when matching", () => {
    expect(matchSpokenOption("nao", ["Não", "Sim"])).toBe("Não");
  });
});

describe("extractSpokenNumber", () => {
  it("extracts a plain integer", () => {
    expect(extractSpokenNumber("42")).toBe("42");
  });

  it("extracts a number embedded in a sentence", () => {
    expect(extractSpokenNumber("a resposta é 17")).toBe("17");
  });

  it("extracts a negative number", () => {
    expect(extractSpokenNumber("é -5")).toBe("-5");
  });

  it("extracts a decimal number with a comma", () => {
    expect(extractSpokenNumber("o valor é 3,5")).toBe("3,5");
  });

  it("falls back to the trimmed transcript when there's no digit", () => {
    expect(extractSpokenNumber("  dezesseis pares  ")).toBe("dezesseis pares");
  });

  it("extracts a fraction without truncating it to the numerator", () => {
    expect(extractSpokenNumber("2/3")).toBe("2/3");
    expect(extractSpokenNumber("a resposta é 2/3")).toBe("2/3");
  });
});

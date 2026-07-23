import { describe, expect, it } from "vitest";
import { parsePhotoSolution } from "./photoSolve";

describe("parsePhotoSolution", () => {
  it("parses a plain JSON response", () => {
    const text = '{"enunciado": "2x + 3 = 7", "passos": ["Subtraia 3", "Divida por 2"], "resposta": "x = 2"}';
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "2x + 3 = 7",
      passos: ["Subtraia 3", "Divida por 2"],
      resposta: "x = 2",
    });
  });

  it("parses JSON wrapped in a markdown fence", () => {
    const text = '```json\n{"enunciado": "1+1", "passos": ["Some"], "resposta": "2"}\n```';
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "1+1",
      passos: ["Some"],
      resposta: "2",
    });
  });

  it("parses JSON wrapped in a bare fence (no language tag)", () => {
    const text = '```\n{"enunciado": "1+1", "passos": ["Some"], "resposta": "2"}\n```';
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "1+1",
      passos: ["Some"],
      resposta: "2",
    });
  });

  it("falls back to raw text as a single step when JSON parsing fails", () => {
    const text = "Não consegui ler essa foto direito.";
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "",
      passos: [text],
      resposta: "",
    });
  });

  it("falls back to raw text when the JSON shape doesn't match", () => {
    const text = '{"foo": "bar"}';
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "",
      passos: [text],
      resposta: "",
    });
  });

  it("rejects a passos array with non-string entries", () => {
    const text = '{"enunciado": "x", "passos": [1, 2], "resposta": "y"}';
    expect(parsePhotoSolution(text)).toEqual({
      enunciado: "",
      passos: [text],
      resposta: "",
    });
  });
});

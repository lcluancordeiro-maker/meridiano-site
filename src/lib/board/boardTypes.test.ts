import { describe, expect, it } from "vitest";
import { isObjectsTool } from "./boardTypes";

describe("isObjectsTool", () => {
  it("is true for every objects-layer tool", () => {
    for (const tool of ["selecionar", "linha", "retangulo", "elipse", "seta", "texto", "imagem"] as const) {
      expect(isObjectsTool(tool)).toBe(true);
    }
  });

  it("is false for every ink tool", () => {
    for (const tool of ["pen", "highlighter", "eraser"] as const) {
      expect(isObjectsTool(tool)).toBe(false);
    }
  });
});

import { describe, expect, it } from "vitest";
import { generateJoinCode } from "./turmaCode";

describe("generateJoinCode", () => {
  it("generates a 6-character code by default", () => {
    expect(generateJoinCode()).toHaveLength(6);
  });

  it("respects a custom length", () => {
    expect(generateJoinCode(10)).toHaveLength(10);
  });

  it("only uses unambiguous uppercase letters and digits", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateJoinCode()).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);
    }
  });

  it("does not produce visually ambiguous characters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateJoinCode(20);
      expect(code).not.toMatch(/[0O1I]/);
    }
  });
});

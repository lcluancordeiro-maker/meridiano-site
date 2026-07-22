import { describe, expect, it } from "vitest";
import { checkPhotoAnswer } from "./answerMatch";

describe("checkPhotoAnswer", () => {
  it("matches identical strings", () => {
    expect(checkPhotoAnswer("12", "12")).toBe(true);
  });

  it("ignores case, whitespace and surrounding spaces", () => {
    expect(checkPhotoAnswer("  Sim  ", "sim")).toBe(true);
    expect(checkPhotoAnswer("x = 5", "x=5")).toBe(true);
  });

  it("strips a leading variable-assignment prefix on either side", () => {
    expect(checkPhotoAnswer("5", "x = 5")).toBe(true);
    expect(checkPhotoAnswer("y = 5", "5")).toBe(true);
  });

  it("matches numerically equivalent expressions (fraction vs decimal)", () => {
    expect(checkPhotoAnswer("0.75", "3/4")).toBe(true);
    expect(checkPhotoAnswer("1/2", "0.5")).toBe(true);
  });

  it("rejects a wrong numeric answer", () => {
    expect(checkPhotoAnswer("4", "5")).toBe(false);
    expect(checkPhotoAnswer("0.5", "3/4")).toBe(false);
  });

  it("rejects unrelated text", () => {
    expect(checkPhotoAnswer("não sei", "12")).toBe(false);
  });

  it("falls back to string comparison when an expression doesn't parse (units, multi-part answers)", () => {
    expect(checkPhotoAnswer("12 cm", "12 cm")).toBe(true);
    expect(checkPhotoAnswer("12", "12 cm")).toBe(false);
    expect(checkPhotoAnswer("x = 2", "x = 2 ou x = -3")).toBe(false);
  });
});

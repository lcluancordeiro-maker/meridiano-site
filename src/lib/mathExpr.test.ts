import { describe, expect, it } from "vitest";
import { compileExpression, MathExprError } from "./mathExpr";

function evalAt(expr: string, x: number): number {
  return compileExpression(expr)(x);
}

describe("compileExpression — arithmetic", () => {
  it("evaluates basic operators", () => {
    expect(evalAt("2+3", 0)).toBe(5);
    expect(evalAt("5-2", 0)).toBe(3);
    expect(evalAt("4*3", 0)).toBe(12);
    expect(evalAt("10/4", 0)).toBe(2.5);
  });

  it("respects operator precedence", () => {
    expect(evalAt("2+3*4", 0)).toBe(14);
    expect(evalAt("(2+3)*4", 0)).toBe(20);
    expect(evalAt("2*3^2", 0)).toBe(18);
  });

  it("handles unary minus with correct precedence relative to exponent", () => {
    // -x^2 must be -(x^2), not (-x)^2 — standard math convention.
    expect(evalAt("-x^2", 3)).toBe(-9);
    expect(evalAt("-2^2", 0)).toBe(-4);
  });

  it("handles right-associative signed exponents", () => {
    expect(evalAt("2^-1", 0)).toBeCloseTo(0.5);
  });
});

describe("compileExpression — variable and implicit multiplication", () => {
  it("substitutes x", () => {
    expect(evalAt("x", 7)).toBe(7);
    expect(evalAt("x^2", 4)).toBe(16);
  });

  it("inserts implicit multiplication between a number and a variable", () => {
    expect(evalAt("2x", 3)).toBe(6);
    expect(evalAt("2x^2", 3)).toBe(18);
  });

  it("inserts implicit multiplication before parentheses", () => {
    expect(evalAt("3(x+1)", 2)).toBe(9);
  });

  it("inserts implicit multiplication between a variable and a function call", () => {
    expect(evalAt("x sin(0)", 5)).toBe(0);
  });
});

describe("compileExpression — functions and constants", () => {
  it("evaluates trig and other named functions", () => {
    expect(evalAt("sin(0)", 0)).toBeCloseTo(0);
    expect(evalAt("cos(0)", 0)).toBeCloseTo(1);
    expect(evalAt("sqrt(x)", 16)).toBe(4);
    expect(evalAt("abs(x)", -5)).toBe(5);
  });

  it("evaluates constants pi and e", () => {
    expect(evalAt("pi", 0)).toBeCloseTo(Math.PI);
    expect(evalAt("e", 0)).toBeCloseTo(Math.E);
  });
});

describe("compileExpression — error handling", () => {
  it("throws MathExprError on empty input", () => {
    expect(() => compileExpression("")).toThrow(MathExprError);
    expect(() => compileExpression("   ")).toThrow(MathExprError);
  });

  it("throws MathExprError on incomplete expressions", () => {
    expect(() => compileExpression("2x+")).toThrow(MathExprError);
    expect(() => compileExpression("(2+3")).toThrow(MathExprError);
  });

  it("throws MathExprError on unknown identifiers", () => {
    expect(() => compileExpression("y + 1")).toThrow(MathExprError);
  });

  it("throws MathExprError on invalid characters", () => {
    expect(() => compileExpression("2 & 3")).toThrow(MathExprError);
  });
});

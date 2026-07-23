import { describe, expect, it } from "vitest";
import { extractPlottableExpression } from "./extractExpression";

describe("extractPlottableExpression", () => {
  it("extracts a f(x) = ... definition", () => {
    expect(extractPlottableExpression("Vamos analisar f(x) = 2x + 3 juntos.")).toBe("2x + 3");
  });

  it("extracts a y = ... definition", () => {
    expect(extractPlottableExpression("A função é y = x^2 - 4, repare na parábola.")).toBe("x^2 - 4");
  });

  it("picks the last valid match when there are several", () => {
    expect(extractPlottableExpression("Primeiro y = x, depois y = x^2 - 1.")).toBe("x^2 - 1");
  });

  it("falls back to a default when nothing plottable is found", () => {
    expect(extractPlottableExpression("Isso não tem nenhuma expressão de função.")).toBe("x^2");
  });

  it("falls back to a default when the candidate doesn't compile", () => {
    expect(extractPlottableExpression("y = alguma coisa incompreensível aqui")).toBe("x^2");
  });
});

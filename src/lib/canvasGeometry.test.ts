import { describe, expect, it } from "vitest";
import { midpoint, pressureToWidth, toCanvasPoint } from "./canvasGeometry";

describe("toCanvasPoint", () => {
  it("maps 1:1 when the display size matches the canvas resolution", () => {
    const rect = { left: 0, top: 0, width: 400, height: 300 };
    expect(toCanvasPoint(rect, 400, 300, 100, 50)).toEqual({ x: 100, y: 50 });
  });

  it("scales up when the canvas is displayed smaller than its resolution", () => {
    const rect = { left: 0, top: 0, width: 200, height: 150 };
    expect(toCanvasPoint(rect, 400, 300, 100, 75)).toEqual({ x: 200, y: 150 });
  });

  it("accounts for the container's offset within the viewport", () => {
    const rect = { left: 50, top: 20, width: 400, height: 300 };
    expect(toCanvasPoint(rect, 400, 300, 150, 70)).toEqual({ x: 100, y: 50 });
  });

  it("does not divide by zero when the rect has no size", () => {
    const rect = { left: 0, top: 0, width: 0, height: 0 };
    expect(toCanvasPoint(rect, 400, 300, 10, 10)).toEqual({ x: 10, y: 10 });
  });
});

describe("midpoint", () => {
  it("averages the coordinates of two points", () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 });
  });

  it("returns the same point when both inputs are equal", () => {
    expect(midpoint({ x: 3, y: 7 }, { x: 3, y: 7 })).toEqual({ x: 3, y: 7 });
  });

  it("handles negative coordinates", () => {
    expect(midpoint({ x: -10, y: 4 }, { x: 10, y: -4 })).toEqual({ x: 0, y: 0 });
  });
});

describe("pressureToWidth", () => {
  it("returns exactly the base width at the default 0.5 pressure (mouse/touch)", () => {
    expect(pressureToWidth(0.5, 8)).toBe(8);
  });

  it("falls back to the 0.5 default when pressure is reported as exactly 0", () => {
    expect(pressureToWidth(0, 8)).toBe(8);
  });

  it("thickens the line for a hard stylus press", () => {
    expect(pressureToWidth(1, 8)).toBe(12);
  });

  it("thins the line for a light stylus touch", () => {
    expect(pressureToWidth(0.1, 8)).toBeCloseTo(4.8);
  });
});

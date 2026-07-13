import { describe, expect, it } from "vitest";
import { toCanvasPoint } from "./canvasGeometry";

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

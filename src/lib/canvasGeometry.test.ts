import { describe, expect, it } from "vitest";
import {
  boundingBoxOfObject,
  hitTestObject,
  midpoint,
  moveShapeEndpoint,
  pressureToWidth,
  resizeByCorner,
  snapEndpointToRuler,
  toCanvasPoint,
  toDisplayPoint,
  translateObject,
} from "./canvasGeometry";
import type { ImageObject, ShapeObject, TextObject } from "./board/boardTypes";

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

describe("toDisplayPoint", () => {
  it("is the inverse of toCanvasPoint", () => {
    const rect = { left: 50, top: 20, width: 200, height: 150 };
    const canvasPoint = toCanvasPoint(rect, 400, 300, 150, 70);
    expect(toDisplayPoint(rect, 400, 300, canvasPoint.x, canvasPoint.y)).toEqual({ x: 150, y: 70 });
  });

  it("does not divide by zero when the canvas has no size", () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    expect(toDisplayPoint(rect, 0, 0, 10, 10)).toEqual({ x: 10, y: 10 });
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

const line: ShapeObject = { id: "1", kind: "shape", shape: "linha", color: "#000", lineWidth: 4, x1: 0, y1: 0, x2: 100, y2: 0 };
const rect: ShapeObject = { id: "2", kind: "shape", shape: "retangulo", color: "#000", lineWidth: 4, x1: 10, y1: 10, x2: 50, y2: 40 };
const ellipse: ShapeObject = { id: "3", kind: "shape", shape: "elipse", color: "#000", lineWidth: 4, x1: 0, y1: 0, x2: 40, y2: 20 };
const text: TextObject = { id: "4", kind: "text", x: 5, y: 20, text: "abc", color: "#000", fontSize: 16 };
const image: ImageObject = { id: "5", kind: "image", x: 0, y: 0, width: 50, height: 30, src: "data:image/png;base64,xx" };

describe("boundingBoxOfObject", () => {
  it("normalizes a shape's corners regardless of drag direction", () => {
    const reversed: ShapeObject = { ...rect, x1: 50, y1: 40, x2: 10, y2: 10 };
    expect(boundingBoxOfObject(reversed)).toEqual({ x1: 10, y1: 10, x2: 50, y2: 40 });
  });

  it("derives a rough box for text from its font size and length", () => {
    const box = boundingBoxOfObject(text);
    expect(box.x1).toBe(5);
    expect(box.y2).toBe(20);
    expect(box.x2).toBeGreaterThan(5);
  });

  it("uses width/height directly for an image", () => {
    expect(boundingBoxOfObject(image)).toEqual({ x1: 0, y1: 0, x2: 50, y2: 30 });
  });
});

describe("hitTestObject", () => {
  it("hits a line only near its segment, not far off it", () => {
    expect(hitTestObject(line, { x: 50, y: 2 }, 5)).toBe(true);
    expect(hitTestObject(line, { x: 50, y: 20 }, 5)).toBe(false);
  });

  it("hits inside an ellipse's oval but not its bounding box's corner", () => {
    expect(hitTestObject(ellipse, { x: 20, y: 10 }, 0)).toBe(true);
    expect(hitTestObject(ellipse, { x: 39, y: 19 }, 0)).toBe(false);
  });

  it("hits within a rectangle's inflated bounding box", () => {
    expect(hitTestObject(rect, { x: 30, y: 25 }, 0)).toBe(true);
    expect(hitTestObject(rect, { x: 5, y: 5 }, 2)).toBe(false);
  });
});

describe("translateObject", () => {
  it("shifts a shape's endpoints", () => {
    expect(translateObject(line, 10, 5)).toEqual({ ...line, x1: 10, y1: 5, x2: 110, y2: 5 });
  });

  it("shifts a text/image's x,y", () => {
    expect(translateObject(text, 1, 2)).toMatchObject({ x: 6, y: 22 });
  });
});

describe("resizeByCorner", () => {
  it("moves the dragged (south-east) corner, keeping the opposite corner fixed", () => {
    const resized = resizeByCorner(rect, "se", { x: 60, y: 45 });
    expect(resized).toEqual({ ...rect, x1: 10, y1: 10, x2: 60, y2: 45 });
  });

  it("re-normalizes when a corner is dragged past the opposite corner", () => {
    const resized = resizeByCorner(rect, "se", { x: 5, y: 5 });
    expect(resized).toEqual({ ...rect, x1: 5, y1: 5, x2: 10, y2: 10 });
  });

  it("resizes an image by recomputing x/y/width/height", () => {
    const resized = resizeByCorner(image, "se", { x: 20, y: 10 });
    expect(resized).toEqual({ ...image, x: 0, y: 0, width: 20, height: 10 });
  });
});

describe("moveShapeEndpoint", () => {
  it("moves only the start point", () => {
    expect(moveShapeEndpoint(line, "start", { x: -10, y: -10 })).toEqual({ ...line, x1: -10, y1: -10 });
  });

  it("moves only the end point", () => {
    expect(moveShapeEndpoint(line, "end", { x: 200, y: 30 })).toEqual({ ...line, x2: 200, y2: 30 });
  });
});

describe("snapEndpointToRuler", () => {
  it("snaps onto the ruler's angle when close enough", () => {
    const snapped = snapEndpointToRuler({ x: 0, y: 0 }, { x: 100, y: 8 }, 0, 6);
    expect(snapped.y).toBeCloseTo(0, 5);
    expect(snapped.x).toBeCloseTo(100, 0);
  });

  it("leaves the end point alone when the angle is too far off", () => {
    const end = { x: 100, y: 60 };
    expect(snapEndpointToRuler({ x: 0, y: 0 }, end, 0, 6)).toEqual(end);
  });

  it("snaps in the opposite direction along the same infinite line too", () => {
    const snapped = snapEndpointToRuler({ x: 0, y: 0 }, { x: -100, y: 3 }, 0, 6);
    expect(snapped.y).toBeCloseTo(0, 5);
  });
});

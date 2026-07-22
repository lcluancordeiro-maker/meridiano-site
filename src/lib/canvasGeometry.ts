/** Maps a pointer event's client coordinates (CSS pixels, relative to the
 * viewport) to a point in the canvas's internal bitmap resolution — needed
 * because the canvas is drawn at a fixed resolution but displayed scaled to
 * its container via CSS. */
export function toCanvasPoint(
  rect: { left: number; top: number; width: number; height: number },
  canvasWidth: number,
  canvasHeight: number,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const scaleX = rect.width === 0 ? 1 : canvasWidth / rect.width;
  const scaleY = rect.height === 0 ? 1 : canvasHeight / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

/** The inverse of `toCanvasPoint` — maps a point in the canvas's internal
 * bitmap resolution back to CSS pixels relative to the viewport. Used to
 * position the inline text-editing `<textarea>` (an HTML overlay, not a
 * canvas drawing) over wherever the student tapped with the "texto" tool. */
export function toDisplayPoint(
  rect: { left: number; top: number; width: number; height: number },
  canvasWidth: number,
  canvasHeight: number,
  canvasX: number,
  canvasY: number
): { x: number; y: number } {
  const scaleX = canvasWidth === 0 ? 1 : rect.width / canvasWidth;
  const scaleY = canvasHeight === 0 ? 1 : rect.height / canvasHeight;
  return {
    x: rect.left + canvasX * scaleX,
    y: rect.top + canvasY * scaleY,
  };
}

/** The point halfway between two points — the control geometry behind the
 * "smooth freehand line" technique: drawing quadratic curves between
 * consecutive midpoints (instead of straight segments point-to-point) removes
 * the faceted look of fast pointermove sampling. */
export function midpoint(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Converts a PointerEvent's `pressure` (0..1, where hardware without
 * pressure support reports a constant 0.5 while active, per spec) into a
 * stroke width. At the default 0.5 this returns exactly `baseWidth`, so mouse
 * and plain-touch input are unaffected — only pressure-sensitive styluses
 * change the line thickness. */
export function pressureToWidth(pressure: number, baseWidth: number): number {
  const p = pressure > 0 ? pressure : 0.5;
  return baseWidth * (0.5 + p);
}

// --- Objects layer (shapes/text/images) geometry — see src/lib/board/boardTypes.ts ---

import type { BoardObject, ImageObject, Point, ResizeHandle, ShapeObject } from "./board/boardTypes";

export function boundingBoxOfObject(object: BoardObject): { x1: number; y1: number; x2: number; y2: number } {
  if (object.kind === "text") {
    // Rough estimate (no canvas context available in a pure function) —
    // good enough for hit-testing/selection, not for pixel-exact layout.
    const width = Math.max(20, object.text.length * object.fontSize * 0.6);
    return { x1: object.x, y1: object.y - object.fontSize, x2: object.x + width, y2: object.y };
  }
  if (object.kind === "image") {
    return { x1: object.x, y1: object.y, x2: object.x + object.width, y2: object.y + object.height };
  }
  return {
    x1: Math.min(object.x1, object.x2),
    y1: Math.min(object.y1, object.y2),
    x2: Math.max(object.x1, object.x2),
    y2: Math.max(object.y1, object.y2),
  };
}

function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** True if `point` is within `tolerance` of the object — a line/arrow hits
 * along its segment, an ellipse hits within its oval (not just its bounding
 * box), everything else falls back to an inflated bounding-box check. Backs
 * both the "selecionar" tool and clicking to delete an object. */
export function hitTestObject(object: BoardObject, point: Point, tolerance: number): boolean {
  if (object.kind === "shape" && (object.shape === "linha" || object.shape === "seta")) {
    return (
      pointToSegmentDistance(point, { x: object.x1, y: object.y1 }, { x: object.x2, y: object.y2 }) <= tolerance
    );
  }
  if (object.kind === "shape" && object.shape === "elipse") {
    const cx = (object.x1 + object.x2) / 2;
    const cy = (object.y1 + object.y2) / 2;
    const rx = Math.abs(object.x2 - object.x1) / 2 + tolerance;
    const ry = Math.abs(object.y2 - object.y1) / 2 + tolerance;
    if (rx === 0 || ry === 0) return false;
    const nx = (point.x - cx) / rx;
    const ny = (point.y - cy) / ry;
    return nx * nx + ny * ny <= 1;
  }
  const box = boundingBoxOfObject(object);
  return (
    point.x >= box.x1 - tolerance &&
    point.x <= box.x2 + tolerance &&
    point.y >= box.y1 - tolerance &&
    point.y <= box.y2 + tolerance
  );
}

/** Shifts any object by (dx, dy) — the "select tool, drag to move" gesture. */
export function translateObject(object: BoardObject, dx: number, dy: number): BoardObject {
  if (object.kind === "shape") {
    return { ...object, x1: object.x1 + dx, y1: object.y1 + dy, x2: object.x2 + dx, y2: object.y2 + dy };
  }
  return { ...object, x: object.x + dx, y: object.y + dy };
}

/** Drags one corner of a rectangle/ellipse/image to `point`, keeping the
 * opposite corner fixed. Lines/arrows resize by dragging an endpoint
 * instead (see `moveShapeEndpoint`) since "corner" isn't meaningful for
 * them. */
export function resizeByCorner<T extends ShapeObject | ImageObject>(object: T, handle: ResizeHandle, point: Point): T {
  const box =
    object.kind === "image"
      ? { x1: object.x, y1: object.y, x2: object.x + object.width, y2: object.y + object.height }
      : boundingBoxOfObject(object);
  let { x1, y1, x2, y2 } = box;
  if (handle === "nw") {
    x1 = point.x;
    y1 = point.y;
  } else if (handle === "ne") {
    x2 = point.x;
    y1 = point.y;
  } else if (handle === "sw") {
    x1 = point.x;
    y2 = point.y;
  } else {
    x2 = point.x;
    y2 = point.y;
  }
  const nx1 = Math.min(x1, x2);
  const ny1 = Math.min(y1, y2);
  const nx2 = Math.max(x1, x2);
  const ny2 = Math.max(y1, y2);
  if (object.kind === "image") {
    return { ...object, x: nx1, y: ny1, width: nx2 - nx1, height: ny2 - ny1 };
  }
  return { ...object, x1: nx1, y1: ny1, x2: nx2, y2: ny2 } as T;
}

/** Drags the start or end point of a line/arrow shape. */
export function moveShapeEndpoint(object: ShapeObject, which: "start" | "end", point: Point): ShapeObject {
  return which === "start" ? { ...object, x1: point.x, y1: point.y } : { ...object, x2: point.x, y2: point.y };
}

/** When a "régua" overlay is active and the student draws a linha/seta
 * starting near it, the end point snaps onto the ruler's infinite line
 * (both directions) if the drawn angle is within `snapDegrees` — mimicking
 * how a physical ruler forces a straight line at a fixed angle. Otherwise
 * returns `end` unchanged (freehand-angled shape). */
export function snapEndpointToRuler(start: Point, end: Point, rulerAngleDeg: number, snapDegrees = 6): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return end;
  const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Fold into [0,180) — a ruler's straightedge is a line, not a ray, so an
  // angle and its opposite (A and A+180) are equally "aligned".
  let angleFromLine = (((currentAngle - rulerAngleDeg) % 180) + 180) % 180;
  if (angleFromLine > 90) angleFromLine = 180 - angleFromLine;
  if (angleFromLine > snapDegrees) return end;
  const rad = (rulerAngleDeg * Math.PI) / 180;
  return { x: start.x + Math.cos(rad) * length, y: start.y + Math.sin(rad) * length };
}

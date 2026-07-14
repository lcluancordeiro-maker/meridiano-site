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

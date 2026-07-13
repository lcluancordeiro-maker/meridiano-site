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

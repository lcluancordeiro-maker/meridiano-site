/** The vector "objects" layer sits on top of the freehand ink canvas
 * (DrawingCanvas.tsx) — shapes, text and inserted images that can be
 * selected, moved, resized and deleted independently, unlike ink strokes
 * which stay a fast raster layer. Keeping the two layers separate avoids
 * rewriting DrawingCanvas's proven, tested freehand/pressure/palm-rejection
 * logic into a slower vector model just to gain select/move/resize. */

export type Point = { x: number; y: number };

export type ShapeKind = "linha" | "retangulo" | "elipse" | "seta";

export type ShapeObject = {
  id: string;
  kind: "shape";
  shape: ShapeKind;
  color: string;
  lineWidth: number;
  /** Two opposite corners for retangulo/elipse, or the two endpoints for
   * linha/seta. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type TextObject = {
  id: string;
  kind: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

export type ImageObject = {
  id: string;
  kind: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  /** A data: URL — kept inline (not a Blob reference) so the object array
   * stays plain JSON, which is what makes boardHistory's snapshots cheap. */
  src: string;
};

export type BoardObject = ShapeObject | TextObject | ImageObject;

/** Which visibility/eraser group an object belongs to — backs the
 * "camadas" toggle (show/hide formas vs imagens) in the toolbar. Ink has
 * its own layer (the DrawingCanvas below) and isn't part of this array. */
export function layerOf(object: BoardObject): "formas" | "imagens" {
  return object.kind === "image" ? "imagens" : "formas";
}

export type ObjectsTool = "selecionar" | ShapeKind | "texto" | "imagem";

export type ResizeHandle = "nw" | "ne" | "sw" | "se";

/** The ink tools (DrawingCanvas.tsx's `Tool`) and the objects-layer tools
 * (`ObjectsTool`) are two separate canvases stacked on top of each other;
 * only one receives pointer events at a time, decided by which group the
 * single active tool belongs to. Keeping one `BoardActiveTool` union (not
 * two independent tool states) is what makes "click a toolbar button"
 * unambiguous — there's exactly one active tool at any moment. */
export type InkTool = "pen" | "highlighter" | "eraser";
export type BoardActiveTool = InkTool | ObjectsTool;

const OBJECTS_TOOLS: ReadonlySet<ObjectsTool> = new Set([
  "selecionar",
  "linha",
  "retangulo",
  "elipse",
  "seta",
  "texto",
  "imagem",
]);

export function isObjectsTool(tool: BoardActiveTool): tool is ObjectsTool {
  return OBJECTS_TOOLS.has(tool as ObjectsTool);
}

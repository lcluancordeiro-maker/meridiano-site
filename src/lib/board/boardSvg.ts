import type { BoardObject } from "./boardTypes";
import { boundingBoxOfObject } from "@/lib/canvasGeometry";

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shapeToSvg(object: Extract<BoardObject, { kind: "shape" }>): string {
  const stroke = `stroke="${object.color}" stroke-width="${object.lineWidth}" fill="none" stroke-linecap="round"`;
  if (object.shape === "linha") {
    return `<line x1="${object.x1}" y1="${object.y1}" x2="${object.x2}" y2="${object.y2}" ${stroke} />`;
  }
  if (object.shape === "seta") {
    const angle = Math.atan2(object.y2 - object.y1, object.x2 - object.x1);
    const headLength = Math.max(10, object.lineWidth * 3);
    const spread = Math.PI / 7;
    const leftX = object.x2 - headLength * Math.cos(angle - spread);
    const leftY = object.y2 - headLength * Math.sin(angle - spread);
    const rightX = object.x2 - headLength * Math.cos(angle + spread);
    const rightY = object.y2 - headLength * Math.sin(angle + spread);
    return (
      `<line x1="${object.x1}" y1="${object.y1}" x2="${object.x2}" y2="${object.y2}" ${stroke} />` +
      `<polygon points="${object.x2},${object.y2} ${leftX},${leftY} ${rightX},${rightY}" fill="${object.color}" />`
    );
  }
  const box = boundingBoxOfObject(object);
  if (object.shape === "retangulo") {
    return `<rect x="${box.x1}" y="${box.y1}" width="${box.x2 - box.x1}" height="${box.y2 - box.y1}" ${stroke} />`;
  }
  const cx = (box.x1 + box.x2) / 2;
  const cy = (box.y1 + box.y2) / 2;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${(box.x2 - box.x1) / 2}" ry="${(box.y2 - box.y1) / 2}" ${stroke} />`;
}

function objectToSvg(object: BoardObject): string {
  if (object.kind === "shape") return shapeToSvg(object);
  if (object.kind === "text") {
    return `<text x="${object.x}" y="${object.y}" font-size="${object.fontSize}" fill="${object.color}" font-family="sans-serif">${escapeXml(object.text)}</text>`;
  }
  return `<image x="${object.x}" y="${object.y}" width="${object.width}" height="${object.height}" href="${object.src}" />`;
}

/** Renders the objects layer (shapes/text/images) as a standalone SVG
 * string, optionally with the ink layer's raster snapshot embedded as a
 * full-bleed background image so "baixar SVG" captures everything on the
 * board, not just the vector objects. Pure — no DOM/canvas needed, so it's
 * testable directly against plain object arrays. */
export function objectsToSvg(
  objects: BoardObject[],
  width: number,
  height: number,
  backgroundColor: string,
  inkSnapshotDataUrl?: string
): string {
  const background = inkSnapshotDataUrl
    ? `<image x="0" y="0" width="${width}" height="${height}" href="${inkSnapshotDataUrl}" />`
    : `<rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}" />`;
  const body = objects.map(objectToSvg).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${background}${body}</svg>`;
}

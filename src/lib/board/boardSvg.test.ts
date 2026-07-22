import { describe, expect, it } from "vitest";
import { objectsToSvg } from "./boardSvg";
import type { BoardObject } from "./boardTypes";

describe("objectsToSvg", () => {
  it("renders an empty board as just a background rect", () => {
    const svg = objectsToSvg([], 200, 100, "#ffffff");
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="200"');
    expect(svg).toContain('fill="#ffffff"');
  });

  it("embeds the ink snapshot as a background image instead of a flat rect when provided", () => {
    const svg = objectsToSvg([], 200, 100, "#ffffff", "data:image/png;base64,AAA");
    expect(svg).toContain('href="data:image/png;base64,AAA"');
    expect(svg).not.toContain('fill="#ffffff"');
  });

  it("renders a line, rectangle, ellipse, text and image", () => {
    const objects: BoardObject[] = [
      { id: "1", kind: "shape", shape: "linha", color: "#111", lineWidth: 3, x1: 0, y1: 0, x2: 10, y2: 10 },
      { id: "2", kind: "shape", shape: "retangulo", color: "#111", lineWidth: 3, x1: 0, y1: 0, x2: 10, y2: 10 },
      { id: "3", kind: "shape", shape: "elipse", color: "#111", lineWidth: 3, x1: 0, y1: 0, x2: 10, y2: 10 },
      { id: "4", kind: "text", x: 1, y: 2, text: "2x + 3 = 7", color: "#111", fontSize: 16 },
      { id: "5", kind: "image", x: 0, y: 0, width: 10, height: 10, src: "data:image/png;base64,BBB" },
    ];
    const svg = objectsToSvg(objects, 100, 100, "#fff");
    expect(svg).toContain("<line");
    expect(svg).toContain("<rect");
    expect(svg).toContain("<ellipse");
    expect(svg).toContain("2x + 3 = 7");
    expect(svg).toContain('href="data:image/png;base64,BBB"');
  });

  it("draws an arrowhead polygon for a seta shape", () => {
    const objects: BoardObject[] = [
      { id: "1", kind: "shape", shape: "seta", color: "#111", lineWidth: 3, x1: 0, y1: 0, x2: 100, y2: 0 },
    ];
    const svg = objectsToSvg(objects, 200, 100, "#fff");
    expect(svg).toContain("<line");
    expect(svg).toContain("<polygon");
  });

  it("escapes XML-sensitive characters in text", () => {
    const objects: BoardObject[] = [
      { id: "1", kind: "text", x: 0, y: 0, text: `a < b & c > "d"`, color: "#111", fontSize: 12 },
    ];
    const svg = objectsToSvg(objects, 100, 100, "#fff");
    expect(svg).toContain("a &lt; b &amp; c &gt; &quot;d&quot;");
  });
});

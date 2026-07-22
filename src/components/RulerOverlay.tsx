"use client";

import { useEffect, useRef, useState } from "react";
import { toCanvasPoint, toDisplayPoint } from "@/lib/canvasGeometry";
import { RESOLUTION_HEIGHT, RESOLUTION_WIDTH } from "@/components/DrawingCanvas";

const RULER_LENGTH = 500;
const RULER_THICKNESS = 60;

/** A draggable, rotatable virtual straightedge overlaid on the board — drag
 * the body to move it, drag the small handle at its right end to rotate.
 * While visible, drawing a linha/seta near it snaps to its exact angle
 * (see snapEndpointToRuler in canvasGeometry.ts and BoardObjectsLayer's use
 * of the `ruler` prop). Toggling "mostrar transferidor" adds degree tick
 * marks and a live angle readout — the same widget doubles as a simple
 * protractor rather than shipping two separate tools. Purely a UI aid: it
 * isn't a board object, has no undo history, and never appears in an
 * exported PNG/SVG. */
export default function RulerOverlay({
  angle,
  onAngleChange,
  cx,
  cy,
  onPositionChange,
  showProtractor,
  containerRef,
}: {
  angle: number;
  onAngleChange: (angle: number) => void;
  cx: number;
  cy: number;
  onPositionChange: (cx: number, cy: number) => void;
  showProtractor: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [dragging, setDragging] = useState<"move" | "rotate" | null>(null);
  const dragStart = useRef<{ pointerX: number; pointerY: number; cx: number; cy: number; angle: number }>({
    pointerX: 0,
    pointerY: 0,
    cx: 0,
    cy: 0,
    angle: 0,
  });

  // Refs can't be read during render (only in effects/handlers), so the
  // container's box is tracked as state instead — updated on mount and
  // whenever it resizes (e.g. toggling fullscreen, zooming the board).
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerRect(el.getBoundingClientRect());
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  function canvasPointFromClient(clientX: number, clientY: number) {
    const container = containerRef.current;
    if (!container) return { x: clientX, y: clientY };
    const rect = container.getBoundingClientRect();
    return toCanvasPoint(rect, RESOLUTION_WIDTH, RESOLUTION_HEIGHT, clientX, clientY);
  }

  function handleBodyPointerDown(event: React.PointerEvent) {
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);
    setDragging("move");
    const point = canvasPointFromClient(event.clientX, event.clientY);
    dragStart.current = { pointerX: point.x, pointerY: point.y, cx, cy, angle };
  }

  function handleRotateHandlePointerDown(event: React.PointerEvent) {
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);
    setDragging("rotate");
    const point = canvasPointFromClient(event.clientX, event.clientY);
    dragStart.current = { pointerX: point.x, pointerY: point.y, cx, cy, angle };
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!dragging) return;
    const point = canvasPointFromClient(event.clientX, event.clientY);
    if (dragging === "move") {
      onPositionChange(
        dragStart.current.cx + (point.x - dragStart.current.pointerX),
        dragStart.current.cy + (point.y - dragStart.current.pointerY)
      );
    } else {
      const newAngle = (Math.atan2(point.y - cy, point.x - cx) * 180) / Math.PI;
      onAngleChange(newAngle);
    }
  }

  function handlePointerUp() {
    setDragging(null);
  }

  if (!containerRect) return null;
  const center = toDisplayPoint(containerRect, RESOLUTION_WIDTH, RESOLUTION_HEIGHT, cx, cy);
  const scale = containerRect.width / RESOLUTION_WIDTH;
  const displayLength = RULER_LENGTH * scale;
  const displayThickness = RULER_THICKNESS * scale;

  const ticks = [];
  if (showProtractor) {
    for (let deg = 0; deg <= 180; deg += 10) {
      ticks.push(deg);
    }
  }

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="pointer-events-auto absolute flex items-center justify-center rounded-lg border-2 border-primary/70 bg-primary/10 shadow-lg"
        style={{
          left: center.x,
          top: center.y,
          width: displayLength,
          height: displayThickness,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          cursor: dragging === "move" ? "grabbing" : "grab",
        }}
        onPointerDown={handleBodyPointerDown}
        role="img"
        aria-label="Régua"
      >
        <span className="rounded bg-white/80 px-1.5 py-0.5 text-xs font-semibold text-primary dark:bg-black/60">
          {Math.round(((angle % 180) + 180) % 180)}°
        </span>
        {ticks.map((deg) => (
          <div
            key={deg}
            className="absolute top-0 w-px bg-primary/50"
            style={{ left: `${(deg / 180) * 100}%`, height: deg % 90 === 0 ? "60%" : "35%" }}
          />
        ))}
        <div
          className="pointer-events-auto absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 cursor-grab rounded-full border-2 border-primary bg-white"
          onPointerDown={handleRotateHandlePointerDown}
          role="button"
          aria-label="Girar régua"
          tabIndex={0}
        />
      </div>
    </div>
  );
}

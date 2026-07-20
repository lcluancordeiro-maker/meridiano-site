"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { midpoint, pressureToWidth, toCanvasPoint } from "@/lib/canvasGeometry";

export type DrawingCanvasHandle = {
  clear: () => void;
  undo: () => void;
  toBlob: () => Promise<Blob | null>;
};

export type Tool = "pen" | "eraser";

type StrokePoint = { x: number; y: number; pressure: number };

const RESOLUTION_WIDTH = 1200;
const RESOLUTION_HEIGHT = 800;
const MAX_UNDO_STEPS = 30;
const LIGHT_PAPER_COLOR = "#ffffff";
const DARK_PAPER_COLOR = "#1c1930";

const DrawingCanvas = forwardRef<
  DrawingCanvasHandle,
  { color: string; lineWidth: number; tool: Tool; ariaLabel: string; onStrokeEnd?: () => void }
>(function DrawingCanvas({ color, lineWidth, tool, ariaLabel, onStrokeEnd }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const undoStack = useRef<ImageData[]>([]);
    const activePointer = useRef<{ id: number; type: string } | null>(null);
    const strokePoints = useRef<StrokePoint[]>([]);
    /** The "paper" color, matching the site theme at the moment the canvas
     * was mounted — used for the initial fill, clear() and the eraser, so
     * erasing gives back the same color as the untouched background instead
     * of always punching a white hole through a dark-mode board. Fixed for
     * the component's lifetime: toggling the theme mid-drawing doesn't
     * retroactively repaint already-drawn strokes. */
    const paperColor = useRef(LIGHT_PAPER_COLOR);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      paperColor.current =
        document.documentElement.getAttribute("data-theme") === "dark" ? DARK_PAPER_COLOR : LIGHT_PAPER_COLOR;
      canvas.width = RESOLUTION_WIDTH;
      canvas.height = RESOLUTION_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = paperColor.current;
      ctx.fillRect(0, 0, RESOLUTION_WIDTH, RESOLUTION_HEIGHT);
    }, []);

    function getContext(): CanvasRenderingContext2D | null {
      return canvasRef.current?.getContext("2d") ?? null;
    }

    function pushUndoSnapshot() {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;
      undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (undoStack.current.length > MAX_UNDO_STEPS) undoStack.current.shift();
    }

    function restoreLastSnapshot() {
      const ctx = getContext();
      const snapshot = undoStack.current.pop();
      if (!ctx || !snapshot) return;
      ctx.putImageData(snapshot, 0, 0);
    }

    useImperativeHandle(ref, () => ({
      clear() {
        const canvas = canvasRef.current;
        const ctx = getContext();
        if (!canvas || !ctx) return;
        pushUndoSnapshot();
        ctx.fillStyle = paperColor.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      undo() {
        restoreLastSnapshot();
      },
      toBlob() {
        return new Promise((resolve) => {
          const canvas = canvasRef.current;
          if (!canvas) {
            resolve(null);
            return;
          }
          canvas.toBlob((blob) => resolve(blob), "image/png");
        });
      },
    }));

    function toStrokePoint(event: PointerEvent | React.PointerEvent<HTMLCanvasElement>): StrokePoint {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const { x, y } = toCanvasPoint(rect, canvas.width, canvas.height, event.clientX, event.clientY);
      return { x, y, pressure: event.pressure };
    }

    function drawDot(point: StrokePoint) {
      const ctx = getContext();
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(point.x, point.y, pressureToWidth(point.pressure, lineWidth) / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === "eraser" ? paperColor.current : color;
      ctx.fill();
    }

    /** Draws a quadratic curve through the midpoints of the last three raw
     * points instead of a straight segment — this is what keeps a fast,
     * naturally-varying-speed stroke looking like handwriting instead of a
     * faceted polyline. Falls back to a straight line for a stroke's first
     * movement, when there aren't three points to smooth yet. */
    function drawSmoothedSegment() {
      const ctx = getContext();
      const points = strokePoints.current;
      if (!ctx || points.length < 2) return;

      const curr = points[points.length - 2];
      const next = points[points.length - 1];
      ctx.strokeStyle = tool === "eraser" ? paperColor.current : color;
      ctx.lineWidth = pressureToWidth(curr.pressure, lineWidth);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      if (points.length < 3) {
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(next.x, next.y);
      } else {
        const prev = points[points.length - 3];
        const from = midpoint(prev, curr);
        const to = midpoint(curr, next);
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(curr.x, curr.y, to.x, to.y);
      }
      ctx.stroke();
    }

    function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const existing = activePointer.current;
      if (existing && existing.id !== event.pointerId) {
        // Basic palm rejection: a stylus always wins over a concurrent touch
        // (e.g. a resting palm) — discard the touch stroke and let the pen
        // take over. Otherwise, ignore any second simultaneous pointer.
        if (event.pointerType === "pen" && existing.type !== "pen") {
          restoreLastSnapshot();
        } else {
          return;
        }
      }

      // Pointer capture keeps receiving move/up events even if the pointer
      // strays outside the canvas mid-stroke; it can legitimately fail (e.g.
      // an already-released pointer) without affecting the drawing itself.
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // ignored — see comment above.
      }
      pushUndoSnapshot();
      activePointer.current = { id: event.pointerId, type: event.pointerType };
      const point = toStrokePoint(event);
      strokePoints.current = [point];
      drawDot(point);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
      if (activePointer.current?.id !== event.pointerId) return;

      const nativeEvent = event.nativeEvent;
      const coalesced = nativeEvent.getCoalescedEvents?.();
      const events = coalesced && coalesced.length > 0 ? coalesced : [nativeEvent];
      for (const raw of events) {
        strokePoints.current.push(toStrokePoint(raw));
        drawSmoothedSegment();
      }
    }

    function endStroke(event: React.PointerEvent<HTMLCanvasElement>) {
      if (activePointer.current?.id !== event.pointerId) return;
      const hadPoints = strokePoints.current.length > 0;
      activePointer.current = null;
      strokePoints.current = [];
      try {
        canvasRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        // ignored — capture may never have been established (see handlePointerDown).
      }
      if (hadPoints) onStrokeEnd?.();
    }

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
        role="img"
        aria-label={ariaLabel}
        className="w-full touch-none rounded-xl border border-border bg-surface"
        style={{ aspectRatio: `${RESOLUTION_WIDTH} / ${RESOLUTION_HEIGHT}` }}
      />
    );
  }
);

export default DrawingCanvas;

"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { toCanvasPoint } from "@/lib/canvasGeometry";

export type DrawingCanvasHandle = {
  clear: () => void;
  undo: () => void;
  toBlob: () => Promise<Blob | null>;
};

export type Tool = "pen" | "eraser";

const RESOLUTION_WIDTH = 1200;
const RESOLUTION_HEIGHT = 800;
const MAX_UNDO_STEPS = 30;

const DrawingCanvas = forwardRef<DrawingCanvasHandle, { color: string; lineWidth: number; tool: Tool }>(
  function DrawingCanvas({ color, lineWidth, tool }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const undoStack = useRef<ImageData[]>([]);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = RESOLUTION_WIDTH;
      canvas.height = RESOLUTION_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
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

    useImperativeHandle(ref, () => ({
      clear() {
        const canvas = canvasRef.current;
        const ctx = getContext();
        if (!canvas || !ctx) return;
        pushUndoSnapshot();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      undo() {
        const ctx = getContext();
        const snapshot = undoStack.current.pop();
        if (!ctx || !snapshot) return;
        ctx.putImageData(snapshot, 0, 0);
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

    function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;
      canvas.setPointerCapture(event.pointerId);
      pushUndoSnapshot();
      const rect = canvas.getBoundingClientRect();
      const point = toCanvasPoint(rect, canvas.width, canvas.height, event.clientX, event.clientY);
      isDrawing.current = true;
      lastPoint.current = point;
      ctx.beginPath();
      ctx.arc(point.x, point.y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.fill();
    }

    function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
      if (!isDrawing.current) return;
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx || !lastPoint.current) return;
      const rect = canvas.getBoundingClientRect();
      const point = toCanvasPoint(rect, canvas.width, canvas.height, event.clientX, event.clientY);
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      lastPoint.current = point;
    }

    function endStroke(event: React.PointerEvent<HTMLCanvasElement>) {
      isDrawing.current = false;
      lastPoint.current = null;
      canvasRef.current?.releasePointerCapture(event.pointerId);
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
        aria-label="Quadro de rascunho"
        className="w-full touch-none rounded-xl border border-border bg-white"
        style={{ aspectRatio: `${RESOLUTION_WIDTH} / ${RESOLUTION_HEIGHT}` }}
      />
    );
  }
);

export default DrawingCanvas;

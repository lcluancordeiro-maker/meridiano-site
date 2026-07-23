"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  boundingBoxOfObject,
  hitTestObject,
  moveShapeEndpoint,
  resizeByCorner,
  snapEndpointToRuler,
  toCanvasPoint,
} from "@/lib/canvasGeometry";
import { commit, createHistory, redo as historyRedo, undo as historyUndo, type BoardHistory } from "@/lib/board/boardHistory";
import {
  layerOf,
  type BoardObject,
  type ImageObject,
  type ObjectsTool,
  type Point,
  type ResizeHandle,
  type ShapeObject,
  type TextObject,
} from "@/lib/board/boardTypes";
import { RESOLUTION_HEIGHT, RESOLUTION_WIDTH } from "@/components/DrawingCanvas";

export type BoardObjectsLayerHandle = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  deleteSelected: () => void;
  addImage: (src: string, naturalWidth: number, naturalHeight: number) => void;
  getObjects: () => BoardObject[];
  toDataUrl: () => string | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

const SELECT_TOLERANCE = 10;
const HANDLE_RADIUS = 8;
const DEFAULT_FONT_SIZE = 28;
const SELECTION_COLOR = "#5b4fe9";

type LayerGroup = "formas" | "imagens";

type DragState =
  | { mode: "none" }
  | { mode: "draw"; shape: ShapeObject["shape"]; start: Point; id: string }
  | { mode: "move"; id: string; startPoint: Point; original: BoardObject }
  | { mode: "resize"; id: string; handle: ResizeHandle | "start" | "end"; original: ShapeObject | ImageObject };

type Draft = { kind: "new"; object: BoardObject } | { kind: "edit"; id: string; object: BoardObject };

type EditingText = { id: string | null; x: number; y: number; value: string };

type HandleSpec = { id: ResizeHandle | "start" | "end"; point: Point };

function handlesFor(object: BoardObject): HandleSpec[] {
  if (object.kind === "text") return [];
  if (object.kind === "shape" && (object.shape === "linha" || object.shape === "seta")) {
    return [
      { id: "start", point: { x: object.x1, y: object.y1 } },
      { id: "end", point: { x: object.x2, y: object.y2 } },
    ];
  }
  const box = boundingBoxOfObject(object);
  return [
    { id: "nw", point: { x: box.x1, y: box.y1 } },
    { id: "ne", point: { x: box.x2, y: box.y1 } },
    { id: "sw", point: { x: box.x1, y: box.y2 } },
    { id: "se", point: { x: box.x2, y: box.y2 } },
  ];
}

function drawArrowhead(ctx: CanvasRenderingContext2D, object: ShapeObject) {
  const angle = Math.atan2(object.y2 - object.y1, object.x2 - object.x1);
  const headLength = Math.max(10, object.lineWidth * 3);
  const spread = Math.PI / 7;
  const leftX = object.x2 - headLength * Math.cos(angle - spread);
  const leftY = object.y2 - headLength * Math.sin(angle - spread);
  const rightX = object.x2 - headLength * Math.cos(angle + spread);
  const rightY = object.y2 - headLength * Math.sin(angle + spread);
  ctx.beginPath();
  ctx.moveTo(object.x2, object.y2);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fillStyle = object.color;
  ctx.fill();
}

const BoardObjectsLayer = forwardRef<
  BoardObjectsLayerHandle,
  {
    tool: ObjectsTool;
    onToolChange: (tool: ObjectsTool) => void;
    color: string;
    lineWidth: number;
    visibleLayers: ReadonlySet<LayerGroup>;
    ruler: { angle: number } | null;
    ariaLabel: string;
    active: boolean;
    onObjectsChanged?: () => void;
    onSelectionChange?: (hasSelection: boolean) => void;
  }
>(function BoardObjectsLayer(
  { tool, onToolChange, color, lineWidth, visibleLayers, ruler, ariaLabel, active, onObjectsChanged, onSelectionChange },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<BoardHistory<BoardObject[]>>(() => createHistory<BoardObject[]>([]));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<EditingText | null>(null);
  const dragState = useRef<DragState>({ mode: "none" });
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadingImages = useRef<Set<string>>(new Set());
  const [imageLoadTick, setImageLoadTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = RESOLUTION_WIDTH;
    canvas.height = RESOLUTION_HEIGHT;
  }, []);

  function select(id: string | null) {
    setSelectedId(id);
    onSelectionChange?.(id !== null);
  }

  function deleteSelected() {
    if (!selectedId) return;
    const nextObjects = history.present.filter((o) => o.id !== selectedId);
    setHistory((h) => commit(h, nextObjects));
    select(null);
    onObjectsChanged?.();
  }

  useEffect(() => {
    if (!selectedId) return;
    function onKeyDown(event: KeyboardEvent) {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelected();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, history]);

  useImperativeHandle(
    ref,
    () => ({
      undo() {
        setHistory((h) => historyUndo(h));
        select(null);
      },
      redo() {
        setHistory((h) => historyRedo(h));
      },
      clear() {
        setHistory((h) => commit(h, []));
        select(null);
        onObjectsChanged?.();
      },
      deleteSelected,
      addImage(src, naturalWidth, naturalHeight) {
        const maxDim = 420;
        const scale = Math.min(1, maxDim / Math.max(naturalWidth, naturalHeight, 1));
        const width = naturalWidth * scale;
        const height = naturalHeight * scale;
        const object: ImageObject = {
          id: crypto.randomUUID(),
          kind: "image",
          x: (RESOLUTION_WIDTH - width) / 2,
          y: (RESOLUTION_HEIGHT - height) / 2,
          width,
          height,
          src,
        };
        setHistory((h) => commit(h, [...h.present, object]));
        select(object.id);
        onObjectsChanged?.();
      },
      getObjects() {
        return history.present;
      },
      toDataUrl() {
        return canvasRef.current?.toDataURL("image/png") ?? null;
      },
      canUndo() {
        return history.past.length > 0;
      },
      canRedo() {
        return history.future.length > 0;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, selectedId]
  );

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return toCanvasPoint(rect, canvas.width, canvas.height, event.clientX, event.clientY);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (editingText) return;
    // The canvas itself isn't focusable, so without this the browser's
    // default "move focus to nearest focusable ancestor" behavior for a
    // mousedown on a non-focusable target fires *after* our handler — right
    // when it inserts and autofocuses the "texto" tool's inline textarea —
    // stealing focus back to <body> and immediately blurring (committing/
    // discarding) it before the student can type anything.
    event.preventDefault();
    const point = getPoint(event);
    try {
      canvasRef.current?.setPointerCapture(event.pointerId);
    } catch {
      // ignored — pointer may already be released elsewhere.
    }

    if (tool === "imagem") {
      // Insertion happens via the toolbar's file picker (BoardObjectsLayerHandle.addImage) —
      // clicking the canvas with this tool active is a no-op.
      return;
    }

    if (tool === "texto") {
      setEditingText({ id: null, x: point.x, y: point.y, value: "" });
      return;
    }

    if (tool === "selecionar") {
      if (selectedId) {
        const current = history.present.find((o) => o.id === selectedId);
        if (current) {
          const handle = handlesFor(current).find(
            (h) => Math.hypot(point.x - h.point.x, point.y - h.point.y) <= HANDLE_RADIUS + 2
          );
          if (handle) {
            dragState.current = { mode: "resize", id: current.id, handle: handle.id, original: current as ShapeObject | ImageObject };
            return;
          }
        }
      }
      const hit = [...history.present]
        .reverse()
        .find((o) => visibleLayers.has(layerOf(o)) && hitTestObject(o, point, SELECT_TOLERANCE));
      if (hit) {
        select(hit.id);
        dragState.current = { mode: "move", id: hit.id, startPoint: point, original: hit };
      } else {
        select(null);
      }
      return;
    }

    // A shape tool: start drawing a new shape.
    const id = crypto.randomUUID();
    const shape: ShapeObject = { id, kind: "shape", shape: tool, color, lineWidth, x1: point.x, y1: point.y, x2: point.x, y2: point.y };
    dragState.current = { mode: "draw", shape: tool, start: point, id };
    setDraft({ kind: "new", object: shape });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragState.current;
    if (drag.mode === "none") return;
    const point = getPoint(event);

    if (drag.mode === "draw") {
      let end = point;
      if (ruler && (drag.shape === "linha" || drag.shape === "seta")) {
        end = snapEndpointToRuler(drag.start, point, ruler.angle);
      }
      setDraft((prev) =>
        prev && prev.kind === "new" && prev.object.kind === "shape"
          ? { kind: "new", object: { ...prev.object, x2: end.x, y2: end.y } }
          : prev
      );
    } else if (drag.mode === "move") {
      const dx = point.x - drag.startPoint.x;
      const dy = point.y - drag.startPoint.y;
      const moved =
        drag.original.kind === "shape"
          ? { ...drag.original, x1: drag.original.x1 + dx, y1: drag.original.y1 + dy, x2: drag.original.x2 + dx, y2: drag.original.y2 + dy }
          : { ...drag.original, x: drag.original.x + dx, y: drag.original.y + dy };
      setDraft({ kind: "edit", id: drag.id, object: moved });
    } else if (drag.mode === "resize") {
      const original = drag.original;
      const updated =
        original.kind === "shape" && (original.shape === "linha" || original.shape === "seta")
          ? moveShapeEndpoint(original, drag.handle as "start" | "end", point)
          : resizeByCorner(original, drag.handle as ResizeHandle, point);
      setDraft({ kind: "edit", id: drag.id, object: updated });
    }
  }

  function handlePointerUp() {
    const drag = dragState.current;
    if (drag.mode === "draw") {
      const object = draft?.kind === "new" ? draft.object : null;
      if (object) {
        const box = boundingBoxOfObject(object);
        const isDegenerate = box.x2 - box.x1 < 3 && box.y2 - box.y1 < 3;
        if (!isDegenerate) {
          setHistory((h) => commit(h, [...h.present, object]));
          select(object.id);
          onToolChange("selecionar");
          onObjectsChanged?.();
        }
      }
      setDraft(null);
    } else if (drag.mode === "move" || drag.mode === "resize") {
      const updated = draft?.kind === "edit" ? draft.object : null;
      if (updated) {
        setHistory((h) => commit(h, h.present.map((o) => (o.id === drag.id ? updated : o))));
        onObjectsChanged?.();
      }
      setDraft(null);
    }
    dragState.current = { mode: "none" };
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (tool !== "selecionar") return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const point = toCanvasPoint(rect, canvas.width, canvas.height, event.clientX, event.clientY);
    const hit = [...history.present].reverse().find((o) => o.kind === "text" && hitTestObject(o, point, SELECT_TOLERANCE));
    if (hit && hit.kind === "text") {
      setEditingText({ id: hit.id, x: hit.x, y: hit.y, value: hit.text });
    }
  }

  function commitText() {
    if (!editingText) return;
    const trimmed = editingText.value.trim();
    if (editingText.id) {
      const nextObjects = trimmed
        ? history.present.map((o) => (o.id === editingText.id ? ({ ...o, text: trimmed } as TextObject) : o))
        : history.present.filter((o) => o.id !== editingText.id);
      setHistory((h) => commit(h, nextObjects));
      onObjectsChanged?.();
    } else if (trimmed) {
      const object: TextObject = {
        id: crypto.randomUUID(),
        kind: "text",
        x: editingText.x,
        y: editingText.y,
        text: trimmed,
        color,
        fontSize: DEFAULT_FONT_SIZE,
      };
      setHistory((h) => commit(h, [...h.present, object]));
      select(object.id);
      onToolChange("selecionar");
      onObjectsChanged?.();
    }
    setEditingText(null);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const list = history.present.map((o) => (draft?.kind === "edit" && draft.id === o.id ? draft.object : o));
    if (draft?.kind === "new") list.push(draft.object);

    for (const object of list) {
      if (!visibleLayers.has(layerOf(object))) continue;
      if (object.kind === "shape") {
        ctx.strokeStyle = object.color;
        ctx.lineWidth = object.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (object.shape === "linha" || object.shape === "seta") {
          ctx.beginPath();
          ctx.moveTo(object.x1, object.y1);
          ctx.lineTo(object.x2, object.y2);
          ctx.stroke();
          if (object.shape === "seta") drawArrowhead(ctx, object);
        } else if (object.shape === "retangulo") {
          const box = boundingBoxOfObject(object);
          ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
        } else {
          const box = boundingBoxOfObject(object);
          ctx.beginPath();
          ctx.ellipse((box.x1 + box.x2) / 2, (box.y1 + box.y2) / 2, (box.x2 - box.x1) / 2, (box.y2 - box.y1) / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (object.kind === "text") {
        ctx.fillStyle = object.color;
        ctx.font = `${object.fontSize}px sans-serif`;
        ctx.textBaseline = "alphabetic";
        ctx.fillText(object.text, object.x, object.y);
      } else {
        const img = imageCache.current.get(object.src);
        if (img) {
          ctx.drawImage(img, object.x, object.y, object.width, object.height);
        } else if (!loadingImages.current.has(object.src)) {
          loadingImages.current.add(object.src);
          const el = new Image();
          el.onload = () => {
            imageCache.current.set(object.src, el);
            setImageLoadTick((t) => t + 1);
          };
          el.src = object.src;
        }
      }
    }

    if (selectedId) {
      const selected = list.find((o) => o.id === selectedId);
      if (selected) {
        const box = boundingBoxOfObject(selected);
        ctx.save();
        ctx.strokeStyle = SELECTION_COLOR;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(box.x1 - 4, box.y1 - 4, box.x2 - box.x1 + 8, box.y2 - box.y1 + 8);
        ctx.setLineDash([]);
        ctx.fillStyle = SELECTION_COLOR;
        for (const handle of handlesFor(selected)) {
          ctx.beginPath();
          ctx.arc(handle.point.x, handle.point.y, HANDLE_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }, [history.present, draft, selectedId, visibleLayers, imageLoadTick]);

  const canvas = canvasRef.current;
  const displayPoint =
    editingText && canvas
      ? (() => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = rect.width / canvas.width;
          const scaleY = rect.height / canvas.height;
          // Positioned so the click point is the textarea's top-left corner
          // (not shifted up by the font size) — a real click's mouseup
          // lands at the exact same coordinate as its mousedown, so the
          // element that appears there needs to actually cover that point,
          // or the browser blurs it immediately as "clicked outside".
          return { x: rect.left + editingText.x * scaleX, y: rect.top + editingText.y * scaleY };
        })()
      : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        role="img"
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ pointerEvents: active ? "auto" : "none" }}
      />
      {editingText && displayPoint && (
        <textarea
          autoFocus
          value={editingText.value}
          onChange={(e) => setEditingText({ ...editingText, value: e.target.value })}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText();
            } else if (e.key === "Escape") {
              setEditingText(null);
            }
          }}
          placeholder="Digite aqui…"
          className="fixed z-10 min-w-[120px] rounded border-2 border-primary bg-white/95 p-1 text-lg text-black shadow-lg dark:bg-black/80 dark:text-white"
          style={{ left: displayPoint.x, top: displayPoint.y }}
        />
      )}
    </>
  );
});

export default BoardObjectsLayer;

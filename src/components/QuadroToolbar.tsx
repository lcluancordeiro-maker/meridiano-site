"use client";

import type { Tool } from "@/components/DrawingCanvas";

type ColorSwatch = { id: string; label: string; value: string };
type LineWidthOption = { label: string; value: number };

export default function QuadroToolbar({
  colors,
  colorId,
  tool,
  onSelectColor,
  lineWidths,
  lineWidth,
  onSelectLineWidth,
  onSelectEraser,
  eraserLabel,
  onUndo,
  undoLabel,
  onRedo,
  redoLabel,
  showGrid,
  onToggleGrid,
  gridLabel,
  onClear,
  clearLabel,
  isExpanded,
  onToggleExpand,
  expandLabel,
  collapseLabel,
}: {
  colors: ColorSwatch[];
  colorId: string;
  tool: Tool;
  onSelectColor: (id: string) => void;
  lineWidths: LineWidthOption[];
  lineWidth: number;
  onSelectLineWidth: (value: number) => void;
  onSelectEraser: () => void;
  eraserLabel: string;
  onUndo: () => void;
  undoLabel: string;
  onRedo: () => void;
  redoLabel: string;
  showGrid: boolean;
  onToggleGrid: () => void;
  gridLabel: string;
  onClear: () => void;
  clearLabel: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  expandLabel: string;
  collapseLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-2">
        {colors.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            onClick={() => onSelectColor(c.id)}
            className="h-7 w-7 rounded-full border-2 transition-transform"
            style={{
              backgroundColor: c.value,
              borderColor: tool === "pen" && colorId === c.id ? "var(--color-primary)" : "transparent",
              transform: tool === "pen" && colorId === c.id ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {lineWidths.map((w) => (
          <button
            key={w.value}
            type="button"
            onClick={() => onSelectLineWidth(w.value)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              lineWidth === w.value ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSelectEraser}
        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
          tool === "eraser" ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
        }`}
      >
        {eraserLabel}
      </button>

      <button
        type="button"
        onClick={onToggleGrid}
        aria-pressed={showGrid}
        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
          showGrid ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
        }`}
      >
        {gridLabel}
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          {undoLabel}
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          {redoLabel}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          {clearLabel}
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-pressed={isExpanded}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          {isExpanded ? collapseLabel : expandLabel}
        </button>
      </div>
    </div>
  );
}

"use client";

import type { ChangeEvent } from "react";
import type { Tool } from "@/components/DrawingCanvas";
import type { GridStyle } from "@/components/QuadroBoard";
import type { ObjectsTool } from "@/lib/board/boardTypes";

type ColorSwatch = { id: string; label: string; value: string };
type LineWidthOption = { label: string; value: number };
type ActiveTool = Tool | ObjectsTool;

const SHAPE_TOOLS: { id: ObjectsTool; label: string; glyph: string }[] = [
  { id: "selecionar", label: "Selecionar", glyph: "↖" },
  { id: "linha", label: "Linha", glyph: "╱" },
  { id: "retangulo", label: "Retângulo", glyph: "▭" },
  { id: "elipse", label: "Elipse", glyph: "◯" },
  { id: "seta", label: "Seta", glyph: "→" },
  { id: "texto", label: "Texto", glyph: "T" },
];

const GRID_STYLES: { id: GridStyle; label: string }[] = [
  { id: "fina", label: "Fina" },
  { id: "grossa", label: "Grossa" },
  { id: "pautada", label: "Pautada" },
  { id: "isometrica", label: "Isométrica" },
];

export default function QuadroToolbar({
  colors,
  colorId,
  customColor,
  onCustomColorChange,
  tool,
  onSelectColor,
  lineWidths,
  lineWidth,
  onSelectLineWidth,
  onSelectHighlighter,
  highlighterLabel,
  onSelectEraser,
  eraserLabel,
  onSelectObjectsTool,
  onInsertImage,
  canDeleteSelected,
  onDeleteSelected,
  showRuler,
  onToggleRuler,
  showProtractor,
  onToggleProtractor,
  onUndo,
  undoLabel,
  onRedo,
  redoLabel,
  showGrid,
  onToggleGrid,
  gridLabel,
  gridStyle,
  onSelectGridStyle,
  visibleLayers,
  onToggleLayer,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onClear,
  clearLabel,
  isExpanded,
  onToggleExpand,
  expandLabel,
  collapseLabel,
  onDownloadSvg,
}: {
  colors: ColorSwatch[];
  colorId: string;
  customColor: string;
  onCustomColorChange: (value: string) => void;
  tool: ActiveTool;
  onSelectColor: (id: string) => void;
  lineWidths: LineWidthOption[];
  lineWidth: number;
  onSelectLineWidth: (value: number) => void;
  onSelectHighlighter: () => void;
  highlighterLabel: string;
  onSelectEraser: () => void;
  eraserLabel: string;
  onSelectObjectsTool: (tool: ObjectsTool) => void;
  onInsertImage: (file: File) => void;
  canDeleteSelected: boolean;
  onDeleteSelected: () => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showProtractor: boolean;
  onToggleProtractor: () => void;
  onUndo: () => void;
  undoLabel: string;
  onRedo: () => void;
  redoLabel: string;
  showGrid: boolean;
  onToggleGrid: () => void;
  gridLabel: string;
  gridStyle: GridStyle;
  onSelectGridStyle: (style: GridStyle) => void;
  visibleLayers: ReadonlySet<"tinta" | "formas" | "imagens">;
  onToggleLayer: (layer: "tinta" | "formas" | "imagens") => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onClear: () => void;
  clearLabel: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  expandLabel: string;
  collapseLabel: string;
  onDownloadSvg: () => void;
}) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onInsertImage(file);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center gap-4">
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
          <input
            type="color"
            aria-label="Cor personalizada"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded-full border-2 border-transparent bg-transparent p-0"
          />
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
          onClick={onSelectHighlighter}
          aria-pressed={tool === "highlighter"}
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
            tool === "highlighter" ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
          }`}
        >
          {highlighterLabel}
        </button>

        <button
          type="button"
          onClick={onSelectEraser}
          aria-pressed={tool === "eraser"}
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
            tool === "eraser" ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
          }`}
        >
          {eraserLabel}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {SHAPE_TOOLS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.label}
            aria-pressed={tool === s.id}
            onClick={() => onSelectObjectsTool(s.id)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              tool === s.id ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
            }`}
          >
            <span aria-hidden>{s.glyph}</span>
            {s.label}
          </button>
        ))}

        <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary">
          <span aria-hidden>🖼</span>
          Imagem
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {canDeleteSelected && (
          <button
            type="button"
            onClick={onDeleteSelected}
            className="rounded-lg border border-error px-2.5 py-1 text-xs font-medium text-error transition-colors hover:bg-error-bg"
          >
            Excluir
          </button>
        )}

        <button
          type="button"
          onClick={onToggleRuler}
          aria-pressed={showRuler}
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
            showRuler ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
          }`}
        >
          Régua
        </button>
        {showRuler && (
          <button
            type="button"
            onClick={onToggleProtractor}
            aria-pressed={showProtractor}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              showProtractor ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
            }`}
          >
            Transferidor
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleGrid}
            aria-pressed={showGrid}
            className={`rounded-lg border px-2.5 py-1 font-medium transition-colors ${
              showGrid ? "border-primary text-primary" : "border-border hover:border-primary"
            }`}
          >
            {gridLabel}
          </button>
          {showGrid && (
            <select
              aria-label="Estilo da grade"
              value={gridStyle}
              onChange={(e) => onSelectGridStyle(e.target.value as GridStyle)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
            >
              {GRID_STYLES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Camadas">
          {(["tinta", "formas", "imagens"] as const).map((layer) => (
            <label key={layer} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleLayers.has(layer)}
                onChange={() => onToggleLayer(layer)}
                className="h-3.5 w-3.5 rounded border-border accent-[var(--color-primary)]"
              />
              {layer === "tinta" ? "Tinta" : layer === "formas" ? "Formas/texto" : "Imagens"}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onZoomOut} aria-label="Diminuir zoom" className="rounded-lg border border-border px-2 py-1">
            −
          </button>
          <span className="w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={onZoomIn} aria-label="Aumentar zoom" className="rounded-lg border border-border px-2 py-1">
            +
          </button>
          <button type="button" onClick={onZoomReset} className="rounded-lg border border-border px-2 py-1">
            Redefinir
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
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
          onClick={onDownloadSvg}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
        >
          Baixar SVG
        </button>
        <div className="ml-auto flex items-center gap-2">
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
    </div>
  );
}

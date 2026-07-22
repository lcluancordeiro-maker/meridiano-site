"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import DrawingCanvas, {
  RESOLUTION_HEIGHT,
  RESOLUTION_WIDTH,
  type DrawingCanvasHandle,
  type Tool,
} from "@/components/DrawingCanvas";
import BoardObjectsLayer, { type BoardObjectsLayerHandle } from "@/components/BoardObjectsLayer";
import RulerOverlay from "@/components/RulerOverlay";
import QuadroToolbar from "@/components/QuadroToolbar";
import SolutionDisplay from "@/components/SolutionDisplay";
import { themeStore } from "@/lib/theme";
import { useTranslation } from "@/i18n/LanguageContext";
import { usePhotoSolve } from "@/lib/usePhotoSolve";
import { objectsToSvg } from "@/lib/board/boardSvg";
import { isObjectsTool, type BoardActiveTool, type ObjectsTool } from "@/lib/board/boardTypes";

const AUTO_ANALYZE_DEBOUNCE_MS = 2000;
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const PAN_STEP = 60;

export type GridStyle = "fina" | "grossa" | "pautada" | "isometrica";

type LayerVisibility = "tinta" | "formas" | "imagens";

function gridBackgroundStyle(style: GridStyle): React.CSSProperties {
  const line = "var(--color-border)";
  if (style === "pautada") {
    return { backgroundImage: `linear-gradient(to bottom, ${line} 1px, transparent 1px)`, backgroundSize: "100% 6%" };
  }
  if (style === "isometrica") {
    return {
      backgroundImage: `linear-gradient(30deg, ${line} 1px, transparent 1px), linear-gradient(-30deg, ${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
      backgroundSize: "5% 8.66%",
    };
  }
  const cell = style === "grossa" ? "8% 8%" : "2.5% 2.5%";
  return {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: cell,
  };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function drawDataUrlOnto(ctx: CanvasRenderingContext2D, dataUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = dataUrl;
  });
}

export default function QuadroBoard({ canResolve }: { canResolve: boolean }) {
  const { dict, locale } = useTranslation();
  const { quadro } = dict;

  // Matches the canvas's own paper color (light paper + dark ink vs. dark
  // "chalkboard" + light chalk) — see DrawingCanvas.tsx's paperColor.
  const isDark = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);

  // Swatches are picked by id, not by raw hex — the "default" swatch's
  // actual color is derived from the current theme at render time, so it
  // never needs a hardcoded "which ink was the default" comparison to
  // re-sync when the theme changes.
  const COLORS = [
    { id: "default", label: isDark ? quadro.corBranco : quadro.corPreto, value: isDark ? "#f1f0f8" : "#1a1a1a" },
    { id: "azul", label: quadro.corAzul, value: "#2a78d6" },
    { id: "vermelho", label: quadro.corVermelho, value: "#d63b3b" },
    { id: "verde", label: quadro.corVerde, value: "#1baf7a" },
  ];

  const LINE_WIDTHS = [
    { label: quadro.fina, value: 4 },
    { label: quadro.media, value: 9 },
    { label: quadro.grossa, value: 16 },
  ];

  const inkRef = useRef<DrawingCanvasHandle>(null);
  const objectsRef = useRef<BoardObjectsLayerHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [colorId, setColorId] = useState("default");
  const [customColor, setCustomColor] = useState("#e6a817");
  const isCustomColor = colorId === "custom";
  const color = isCustomColor ? customColor : COLORS.find((c) => c.id === colorId)?.value ?? COLORS[0].value;
  const [lineWidth, setLineWidth] = useState(LINE_WIDTHS[1].value);
  const [activeTool, setActiveTool] = useState<BoardActiveTool>("pen");
  const [showGrid, setShowGrid] = useState(false);
  const [gridStyle, setGridStyle] = useState<GridStyle>("fina");
  const [visibleLayers, setVisibleLayers] = useState<ReadonlySet<LayerVisibility>>(
    new Set(["tinta", "formas", "imagens"])
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showRuler, setShowRuler] = useState(false);
  const [showProtractor, setShowProtractor] = useState(false);
  const [rulerAngle, setRulerAngle] = useState(0);
  const [rulerCenter, setRulerCenter] = useState({ cx: RESOLUTION_WIDTH / 2, cy: RESOLUTION_HEIGHT / 2 });
  const [lastEditedLayer, setLastEditedLayer] = useState<"ink" | "objects">("ink");
  const [hasObjectSelection, setHasObjectSelection] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const statusRef = useRef<"idle" | "loading" | "error">("idle");
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const { status, errorText, solution, resolve, fail, generateSimilar, generatingSimilar } = usePhotoSolve(
    dict,
    locale
  );

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!isExpanded) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsExpanded(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  function selectColor(id: string) {
    setColorId(id);
    setActiveTool("pen");
  }

  function selectCustomColor(value: string) {
    setCustomColor(value);
    setColorId("custom");
    setActiveTool("pen");
  }

  function selectObjectsTool(tool: ObjectsTool) {
    setActiveTool(tool);
  }

  function toggleLayer(layer: LayerVisibility) {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }

  async function handleInsertImage(file: File) {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = new Image();
    img.onload = () => {
      objectsRef.current?.addImage(dataUrl, img.naturalWidth, img.naturalHeight);
      setLastEditedLayer("objects");
      setActiveTool("selecionar");
    };
    img.src = dataUrl;
  }

  async function mergeLayersToCanvas(): Promise<HTMLCanvasElement> {
    const merged = document.createElement("canvas");
    merged.width = RESOLUTION_WIDTH;
    merged.height = RESOLUTION_HEIGHT;
    const ctx = merged.getContext("2d")!;
    const inkUrl = inkRef.current?.toDataUrl();
    if (inkUrl) await drawDataUrlOnto(ctx, inkUrl);
    const objectsUrl = objectsRef.current?.toDataUrl();
    if (objectsUrl) await drawDataUrlOnto(ctx, objectsUrl);
    return merged;
  }

  function handleDownloadPng() {
    mergeLayersToCanvas().then((merged) => {
      merged.toBlob((blob) => {
        if (!blob) return;
        downloadBlob(blob, "quadro-meridiano.png");
      }, "image/png");
    });
  }

  function handleDownloadSvg() {
    const objects = objectsRef.current?.getObjects() ?? [];
    const inkUrl = inkRef.current?.toDataUrl() ?? undefined;
    const backgroundColor = isDark ? "#1c1930" : "#ffffff";
    const svg = objectsToSvg(objects, RESOLUTION_WIDTH, RESOLUTION_HEIGHT, backgroundColor, inkUrl);
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "quadro-meridiano.svg");
  }

  const handleResolve = useCallback(async () => {
    const merged = await mergeLayersToCanvas();
    const blob = await new Promise<Blob | null>((resolve) => merged.toBlob(resolve, "image/png"));
    if (!blob) {
      fail("missing_image");
      return;
    }
    await resolve([{ blob, filename: "quadro.png" }]);
  }, [resolve, fail]);

  const handleBoardChanged = useCallback(
    (layer: "ink" | "objects") => {
      setLastEditedLayer(layer);
      if (!autoAnalyze || !canResolve) return;
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      autoTimerRef.current = setTimeout(() => {
        if (statusRef.current !== "loading") void handleResolve();
      }, AUTO_ANALYZE_DEBOUNCE_MS);
    },
    [autoAnalyze, canResolve, handleResolve]
  );

  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []);

  function handleUndo() {
    const preferred = lastEditedLayer === "objects" ? objectsRef : inkRef;
    const fallback = lastEditedLayer === "objects" ? inkRef : objectsRef;
    if (preferred.current?.canUndo()) {
      preferred.current.undo();
      return;
    }
    if (fallback.current?.canUndo()) {
      fallback.current.undo();
      setLastEditedLayer(fallback === inkRef ? "ink" : "objects");
    }
  }

  function handleRedo() {
    const preferred = lastEditedLayer === "objects" ? objectsRef : inkRef;
    const fallback = lastEditedLayer === "objects" ? inkRef : objectsRef;
    if (preferred.current?.canRedo()) {
      preferred.current.redo();
      return;
    }
    if (fallback.current?.canRedo()) {
      fallback.current.redo();
      setLastEditedLayer(fallback === inkRef ? "ink" : "objects");
    }
  }

  function handleClear() {
    inkRef.current?.clear();
    objectsRef.current?.clear();
  }

  const isTargetingObjectsLayer = isObjectsTool(activeTool);
  const inkTool: Tool = activeTool === "pen" || activeTool === "highlighter" || activeTool === "eraser" ? activeTool : "pen";
  const objectsTool: ObjectsTool = isTargetingObjectsLayer ? (activeTool as ObjectsTool) : "selecionar";

  return (
    <div className={isExpanded ? "fixed inset-0 z-50 flex flex-col gap-4 overflow-auto bg-background p-4" : "flex flex-col gap-4"}>
      <QuadroToolbar
        colors={COLORS}
        colorId={colorId}
        customColor={customColor}
        onCustomColorChange={selectCustomColor}
        tool={activeTool}
        onSelectColor={selectColor}
        lineWidths={LINE_WIDTHS}
        lineWidth={lineWidth}
        onSelectLineWidth={setLineWidth}
        onSelectHighlighter={() => setActiveTool("highlighter")}
        highlighterLabel="Marca-texto"
        onSelectEraser={() => setActiveTool("eraser")}
        eraserLabel={quadro.borracha}
        onSelectObjectsTool={selectObjectsTool}
        onInsertImage={handleInsertImage}
        canDeleteSelected={hasObjectSelection}
        onDeleteSelected={() => objectsRef.current?.deleteSelected()}
        showRuler={showRuler}
        onToggleRuler={() => setShowRuler((v) => !v)}
        showProtractor={showProtractor}
        onToggleProtractor={() => setShowProtractor((v) => !v)}
        onUndo={handleUndo}
        undoLabel={quadro.desfazer}
        onRedo={handleRedo}
        redoLabel={quadro.refazer}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        gridLabel={quadro.grade}
        gridStyle={gridStyle}
        onSelectGridStyle={setGridStyle}
        visibleLayers={visibleLayers}
        onToggleLayer={toggleLayer}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
        onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
        onZoomReset={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        onClear={handleClear}
        clearLabel={quadro.limpar}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((v) => !v)}
        expandLabel={quadro.expandir}
        collapseLabel={quadro.recolher}
        onDownloadSvg={handleDownloadSvg}
      />

      <div className="flex items-center justify-center gap-1">
        {(
          [
            ["←", { x: pan.x + PAN_STEP, y: pan.y }],
            ["↑", { x: pan.x, y: pan.y + PAN_STEP }],
            ["↓", { x: pan.x, y: pan.y - PAN_STEP }],
            ["→", { x: pan.x - PAN_STEP, y: pan.y }],
          ] as const
        ).map(([glyph, next]) => (
          <button
            key={glyph}
            type="button"
            aria-label={`Mover quadro ${glyph}`}
            onClick={() => setPan(next)}
            className="rounded-lg border border-border px-2 py-1 text-xs text-muted hover:border-primary"
          >
            {glyph}
          </button>
        ))}
      </div>

      <div ref={stageRef} className="relative overflow-hidden rounded-xl border border-border" style={{ aspectRatio: `${RESOLUTION_WIDTH} / ${RESOLUTION_HEIGHT}` }}>
        <div
          className="relative h-full w-full origin-center"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {showGrid && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-60" style={gridBackgroundStyle(gridStyle)} />
          )}
          <div style={{ display: visibleLayers.has("tinta") ? undefined : "none" }} className="absolute inset-0">
            <DrawingCanvas
              ref={inkRef}
              color={color}
              lineWidth={lineWidth}
              tool={inkTool}
              ariaLabel={quadro.title}
              onStrokeEnd={() => handleBoardChanged("ink")}
            />
          </div>
          <BoardObjectsLayer
            ref={objectsRef}
            tool={objectsTool}
            onToolChange={setActiveTool}
            color={color}
            lineWidth={lineWidth}
            visibleLayers={visibleLayers as ReadonlySet<"formas" | "imagens">}
            ruler={showRuler ? { angle: rulerAngle } : null}
            ariaLabel="Camada de formas e texto"
            active={isTargetingObjectsLayer}
            onObjectsChanged={() => handleBoardChanged("objects")}
            onSelectionChange={setHasObjectSelection}
          />
          {showRuler && (
            <RulerOverlay
              angle={rulerAngle}
              onAngleChange={setRulerAngle}
              cx={rulerCenter.cx}
              cy={rulerCenter.cy}
              onPositionChange={(cx, cy) => setRulerCenter({ cx, cy })}
              showProtractor={showProtractor}
              containerRef={stageRef}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadPng}
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          {quadro.baixarPng}
        </button>

        {canResolve ? (
          <>
            <button
              type="button"
              onClick={handleResolve}
              disabled={status === "loading"}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? quadro.analisando : quadro.resolverIA}
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--color-primary)]"
              />
              {quadro.autoAnalisar}
            </label>
          </>
        ) : (
          <p className="text-sm text-muted">
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              {quadro.facaLogin}
            </Link>{" "}
            {quadro.paraResolver}
          </p>
        )}
      </div>

      {errorText && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{errorText}</p>}

      {solution && (
        <SolutionDisplay
          key={JSON.stringify(solution)}
          solution={solution}
          onPracticeSimilar={() => generateSimilar(solution.enunciado)}
          isGeneratingSimilar={generatingSimilar}
        />
      )}
    </div>
  );
}

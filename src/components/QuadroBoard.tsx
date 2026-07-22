"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import DrawingCanvas, { type DrawingCanvasHandle, type Tool } from "@/components/DrawingCanvas";
import QuadroToolbar from "@/components/QuadroToolbar";
import SolutionDisplay from "@/components/SolutionDisplay";
import { themeStore } from "@/lib/theme";
import { useTranslation } from "@/i18n/LanguageContext";
import { usePhotoSolve } from "@/lib/usePhotoSolve";

const AUTO_ANALYZE_DEBOUNCE_MS = 2000;

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

  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [colorId, setColorId] = useState("default");
  const color = COLORS.find((c) => c.id === colorId)?.value ?? COLORS[0].value;
  const [lineWidth, setLineWidth] = useState(LINE_WIDTHS[1].value);
  const [tool, setTool] = useState<Tool>("pen");
  const [showGrid, setShowGrid] = useState(false);
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
    setTool("pen");
  }

  function handleDownload() {
    canvasRef.current?.toBlob().then((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quadro-meridiano.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const handleResolve = useCallback(async () => {
    const blob = await canvasRef.current?.toBlob();
    if (!blob) {
      fail("missing_image");
      return;
    }
    await resolve([{ blob, filename: "quadro.png" }]);
  }, [resolve, fail]);

  const handleStrokeEnd = useCallback(() => {
    if (!autoAnalyze || !canResolve) return;
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      if (statusRef.current !== "loading") void handleResolve();
    }, AUTO_ANALYZE_DEBOUNCE_MS);
  }, [autoAnalyze, canResolve, handleResolve]);

  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []);

  return (
    <div className={isExpanded ? "fixed inset-0 z-50 flex flex-col gap-4 overflow-auto bg-background p-4" : "flex flex-col gap-4"}>
      <QuadroToolbar
        colors={COLORS}
        colorId={colorId}
        tool={tool}
        onSelectColor={selectColor}
        lineWidths={LINE_WIDTHS}
        lineWidth={lineWidth}
        onSelectLineWidth={setLineWidth}
        onSelectEraser={() => setTool("eraser")}
        eraserLabel={quadro.borracha}
        onUndo={() => canvasRef.current?.undo()}
        undoLabel={quadro.desfazer}
        onRedo={() => canvasRef.current?.redo()}
        redoLabel={quadro.refazer}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        gridLabel={quadro.grade}
        onClear={() => canvasRef.current?.clear()}
        clearLabel={quadro.limpar}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((v) => !v)}
        expandLabel={quadro.expandir}
        collapseLabel={quadro.recolher}
      />

      <div className="relative">
        <DrawingCanvas
          ref={canvasRef}
          color={color}
          lineWidth={lineWidth}
          tool={tool}
          ariaLabel={quadro.title}
          onStrokeEnd={handleStrokeEnd}
        />
        {showGrid && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "5% 5%",
              opacity: 0.6,
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
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

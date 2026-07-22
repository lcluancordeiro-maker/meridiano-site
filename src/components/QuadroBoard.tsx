"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import DrawingCanvas, { type DrawingCanvasHandle, type Tool } from "@/components/DrawingCanvas";
import SolutionDisplay from "@/components/SolutionDisplay";
import type { PhotoSolution } from "@/lib/photoSolve";
import { errorMessageFor } from "@/lib/photoSolveErrors";
import { themeStore } from "@/lib/theme";
import { useTranslation } from "@/i18n/LanguageContext";

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
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const statusRef = useRef(status);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [solution, setSolution] = useState<PhotoSolution | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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
    setStatus("loading");
    setErrorText(null);
    setSolution(null);

    try {
      const blob = await canvasRef.current?.toBlob();
      if (!blob) {
        setErrorText(errorMessageFor(dict, "missing_image"));
        setStatus("error");
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "quadro.png");
      formData.append("locale", locale);

      const res = await fetch("/api/resolver-foto", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorText(errorMessageFor(dict, data?.error));
        setStatus("error");
        return;
      }

      setSolution(data.solution);
      setStatus("idle");
    } catch {
      setErrorText(errorMessageFor(dict, undefined));
      setStatus("error");
    }
  }, [dict, locale]);

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={c.label}
              onClick={() => selectColor(c.id)}
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
          {LINE_WIDTHS.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => setLineWidth(w.value)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                lineWidth === w.value
                  ? "border-primary text-primary"
                  : "border-border text-muted hover:border-primary"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTool("eraser")}
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
            tool === "eraser" ? "border-primary text-primary" : "border-border text-muted hover:border-primary"
          }`}
        >
          {quadro.borracha}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => canvasRef.current?.undo()}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
          >
            {quadro.desfazer}
          </button>
          <button
            type="button"
            onClick={() => canvasRef.current?.clear()}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
          >
            {quadro.limpar}
          </button>
        </div>
      </div>

      <DrawingCanvas
        ref={canvasRef}
        color={color}
        lineWidth={lineWidth}
        tool={tool}
        ariaLabel={quadro.title}
        onStrokeEnd={handleStrokeEnd}
      />

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

      {solution && <SolutionDisplay key={JSON.stringify(solution)} solution={solution} />}
    </div>
  );
}

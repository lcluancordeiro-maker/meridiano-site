"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import DrawingCanvas, { type DrawingCanvasHandle, type Tool } from "@/components/DrawingCanvas";
import SolutionDisplay from "@/components/SolutionDisplay";
import type { PhotoSolution } from "@/lib/photoSolve";
import { errorMessageFor } from "@/lib/photoSolveErrors";

const COLORS = [
  { label: "Preto", value: "#1a1a1a" },
  { label: "Azul", value: "#2a78d6" },
  { label: "Vermelho", value: "#d63b3b" },
  { label: "Verde", value: "#1baf7a" },
];

const LINE_WIDTHS = [
  { label: "Fina", value: 4 },
  { label: "Média", value: 9 },
  { label: "Grossa", value: 16 },
];

export default function QuadroBoard({ canResolve }: { canResolve: boolean }) {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [lineWidth, setLineWidth] = useState(LINE_WIDTHS[1].value);
  const [tool, setTool] = useState<Tool>("pen");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [solution, setSolution] = useState<PhotoSolution | null>(null);

  function selectColor(value: string) {
    setColor(value);
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

  async function handleResolve() {
    setStatus("loading");
    setErrorText(null);
    setSolution(null);

    try {
      const blob = await canvasRef.current?.toBlob();
      if (!blob) {
        setErrorText(errorMessageFor("missing_image"));
        setStatus("error");
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "quadro.png");

      const res = await fetch("/api/resolver-foto", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorText(errorMessageFor(data?.error));
        setStatus("error");
        return;
      }

      setSolution(data.solution);
      setStatus("idle");
    } catch {
      setErrorText(errorMessageFor(undefined));
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={`Cor ${c.label}`}
              onClick={() => selectColor(c.value)}
              className="h-7 w-7 rounded-full border-2 transition-transform"
              style={{
                backgroundColor: c.value,
                borderColor: tool === "pen" && color === c.value ? "var(--color-primary)" : "transparent",
                transform: tool === "pen" && color === c.value ? "scale(1.15)" : "scale(1)",
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
          Borracha
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => canvasRef.current?.undo()}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
          >
            Desfazer
          </button>
          <button
            type="button"
            onClick={() => canvasRef.current?.clear()}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
          >
            Limpar
          </button>
        </div>
      </div>

      <DrawingCanvas ref={canvasRef} color={color} lineWidth={lineWidth} tool={tool} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          Baixar PNG
        </button>

        {canResolve ? (
          <button
            type="button"
            onClick={handleResolve}
            disabled={status === "loading"}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Analisando..." : "Resolver com IA"}
          </button>
        ) : (
          <p className="text-sm text-muted">
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              Faça login
            </Link>{" "}
            para pedir a solução do que você desenhou.
          </p>
        )}
      </div>

      {errorText && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{errorText}</p>}

      {solution && <SolutionDisplay solution={solution} />}
    </div>
  );
}

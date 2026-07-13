"use client";

import { useRef, useState } from "react";
import type { PhotoSolution } from "@/lib/photoSolve";

const ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "Formato de imagem não suportado. Use JPEG, PNG, GIF ou WEBP.",
  image_too_large: "A imagem é muito grande (máximo 8MB).",
  missing_image: "Selecione uma foto antes de enviar.",
  daily_limit_exceeded: "Você atingiu o limite diário de fotos resolvidas. Tente novamente amanhã.",
  unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
  anthropic_not_configured: "Essa funcionalidade ainda não está disponível.",
  ai_error: "Não foi possível analisar a foto agora. Tente novamente em instantes.",
  empty_response: "Não foi possível analisar a foto agora. Tente novamente em instantes.",
};

function errorMessageFor(code: string | undefined): string {
  return (code && ERROR_MESSAGES[code]) || "Algo deu errado ao processar a foto. Tente novamente.";
}

export default function PhotoSolver() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [solution, setSolution] = useState<PhotoSolution | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setSolution(null);
    setErrorText(null);
    setStatus("idle");
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSubmit() {
    if (!file) return;
    setStatus("loading");
    setErrorText(null);
    setSolution(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

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

  function handleReset() {
    setFile(null);
    setPreview(null);
    setSolution(null);
    setErrorText(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      {!preview ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-12 text-center transition-colors hover:border-primary">
          <span className="text-sm font-medium text-foreground">Tirar foto ou escolher da galeria</span>
          <span className="text-xs text-muted">JPEG, PNG, GIF ou WEBP — até 8MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            capture="environment"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Foto do problema selecionado" className="max-h-96 w-full object-contain bg-black/5" />
        </div>
      )}

      {preview && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Analisando..." : "Resolver"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={status === "loading"}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trocar foto
          </button>
        </div>
      )}

      {errorText && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{errorText}</p>}

      {solution && (
        <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          {solution.enunciado && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Enunciado</h2>
              <p className="mt-1 text-foreground">{solution.enunciado}</p>
            </div>
          )}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Passo a passo</h2>
            <ol className="mt-2 flex flex-col gap-2">
              {solution.passos.map((passo, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{passo}</span>
                </li>
              ))}
            </ol>
          </div>
          {solution.resposta && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Resposta</h2>
              <p className="mt-1 font-semibold text-foreground">{solution.resposta}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

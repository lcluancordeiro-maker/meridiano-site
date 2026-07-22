"use client";

import { useRef, useState } from "react";
import SolutionDisplay from "@/components/SolutionDisplay";
import { useTranslation } from "@/i18n/LanguageContext";
import { usePhotoSolve } from "@/lib/usePhotoSolve";

export default function PhotoSolver() {
  const { dict, locale } = useTranslation();
  const { foto } = dict;
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, errorText, solution, resolve, reset, generateSimilar, generatingSimilar } = usePhotoSolve(
    dict,
    locale
  );

  function selectFile(selected: File) {
    reset();
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) selectFile(selected);
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) selectFile(dropped);
  }

  async function handleSubmit() {
    if (!file) return;
    await resolve(file, file.name);
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      {!preview ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary"
          }`}
        >
          <span className="text-sm font-medium text-foreground">{foto.tirarFoto}</span>
          <span className="text-xs text-muted">{foto.formatoInfo}</span>
          <span className="text-xs text-muted">{foto.arrasteAqui}</span>
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
            {status === "loading" ? foto.analisando : foto.resolver}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={status === "loading"}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {foto.trocarFoto}
          </button>
        </div>
      )}

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

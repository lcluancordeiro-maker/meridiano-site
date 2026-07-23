"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SolutionDisplay from "@/components/SolutionDisplay";
import { useTranslation } from "@/i18n/LanguageContext";
import { usePhotoSolve } from "@/lib/usePhotoSolve";
import { MAX_IMAGES, validateImageBatch } from "@/lib/photoImageLimits";

export default function PhotoSolver() {
  const { dict, locale } = useTranslation();
  const { foto } = dict;
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, errorText, solution, resolve, reset, fail, generateSimilar, generatingSimilar } = usePhotoSolve(
    dict,
    locale
  );

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  // Object URLs are only valid while their File is still around — revoke the
  // previous batch whenever the file list changes or the component unmounts,
  // instead of leaking one per selected photo.
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function addFiles(selected: File[]) {
    reset();
    setFiles((prev) => [...prev, ...selected].slice(0, MAX_IMAGES));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length) addFiles(selected);
    event.target.value = "";
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
    const dropped = Array.from(event.dataTransfer.files ?? []);
    if (dropped.length) addFiles(dropped);
  }

  async function handleSubmit() {
    const validationError = validateImageBatch(files);
    if (validationError) {
      fail(validationError);
      return;
    }
    await resolve(files.map((file) => ({ blob: file, filename: file.name })));
  }

  function handleReset() {
    setFiles([]);
    reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  const canAddMore = files.length < MAX_IMAGES;

  return (
    <div className="flex flex-col gap-4">
      {files.length === 0 ? (
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
          <span className="text-xs text-muted">{foto.maxFotosInfo}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            capture="environment"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Foto ${i + 1}`} className="h-32 w-full object-cover bg-black/5" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={foto.removerFoto}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition-colors hover:bg-black/80"
              >
                ×
              </button>
            </div>
          ))}
          {canAddMore && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-2 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary"
              }`}
            >
              <span className="text-xs font-medium text-foreground">{foto.adicionarFoto}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                capture="environment"
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
      )}

      {files.length > 0 && (
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

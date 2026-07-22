"use client";

import { useCallback, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { PhotoSolution } from "@/lib/photoSolve";
import { errorMessageFor } from "@/lib/photoSolveErrors";

/** Shared client-side logic behind "resolver por foto" — used by both the
 * photo upload flow (PhotoSolver.tsx) and the drawing board's "Resolver com
 * IA" button (QuadroBoard.tsx), which otherwise duplicated the same
 * fetch/status/error/solution handling for /api/resolver-foto almost
 * verbatim. */
export function usePhotoSolve(dict: Dictionary, locale: Locale) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [solution, setSolution] = useState<PhotoSolution | null>(null);

  const resolve = useCallback(
    async (image: Blob, filename: string) => {
      setStatus("loading");
      setErrorText(null);
      setSolution(null);

      try {
        const formData = new FormData();
        formData.append("image", image, filename);
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
    },
    [dict, locale]
  );

  const fail = useCallback(
    (code?: string) => {
      setErrorText(errorMessageFor(dict, code));
      setStatus("error");
    },
    [dict]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorText(null);
    setSolution(null);
  }, []);

  return { status, errorText, solution, resolve, fail, reset };
}

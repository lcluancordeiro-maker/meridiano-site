"use client";

import { useState, useTransition } from "react";
import { createCollabBoardSession } from "@/app/actions/collabBoard";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateCollabBoardForm() {
  const { dict } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await createCollabBoardSession();
      setError(result?.error ?? null);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{error}</p>}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.collabBoard.createButton}
      </button>
    </div>
  );
}

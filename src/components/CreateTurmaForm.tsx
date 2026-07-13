"use client";

import { useActionState } from "react";
import { createTurma } from "@/app/actions/turmas";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateTurmaForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(createTurma, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="turma-name" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.turmas.nameLabel}
        </label>
        <input
          id="turma-name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.turmas.createButton}
      </button>
    </form>
  );
}

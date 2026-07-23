"use client";

import { useActionState } from "react";
import { joinTurma } from "@/app/actions/turmas";
import { useTranslation } from "@/i18n/LanguageContext";

export default function JoinTurmaForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(joinTurma, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="turma-code" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.turmas.codeLabel}
        </label>
        <input
          id="turma-code"
          name="code"
          type="text"
          required
          autoCapitalize="characters"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm uppercase outline-none focus:border-primary"
        />
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.turmas.joinButton}
      </button>
    </form>
  );
}

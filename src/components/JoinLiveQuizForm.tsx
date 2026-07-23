"use client";

import { useActionState } from "react";
import { joinLiveQuiz } from "@/app/actions/liveQuiz";
import { useTranslation } from "@/i18n/LanguageContext";

export default function JoinLiveQuizForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(joinLiveQuiz, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="live-quiz-code" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.liveQuiz.codeLabel}
        </label>
        <input
          id="live-quiz-code"
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
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.liveQuiz.joinButton}
      </button>
    </form>
  );
}

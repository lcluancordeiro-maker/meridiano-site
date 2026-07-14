"use client";

import { useActionState } from "react";
import { requestParentalConsent } from "@/app/actions/identity";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ParentalConsentForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(requestParentalConsent, undefined);

  if (state?.sent) {
    return <p className="rounded-xl border border-success bg-success-bg p-4 text-sm text-success">{dict.identity.consentSentMessage}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="parent-email" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.identity.parentEmailLabel}
        </label>
        <input
          id="parent-email"
          name="parentEmail"
          type="email"
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
        {dict.identity.sendConsentButton}
      </button>
    </form>
  );
}

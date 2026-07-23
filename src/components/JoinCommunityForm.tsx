"use client";

import { useActionState } from "react";
import { joinCommunity } from "@/app/actions/communities";
import { useTranslation } from "@/i18n/LanguageContext";

export default function JoinCommunityForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(joinCommunity, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="community-code" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.communities.codeLabel}
        </label>
        <input
          id="community-code"
          name="code"
          type="text"
          required
          className="w-full rounded-xl border border-border px-4 py-3 text-sm uppercase outline-none focus:border-primary"
        />
      </div>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.communities.joinButton}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { createCommunity } from "@/app/actions/communities";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateCommunityForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(createCommunity, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="community-name" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.communities.nameLabel}
        </label>
        <input
          id="community-name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="community-description" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.communities.descriptionLabel}
        </label>
        <textarea
          id="community-description"
          name="description"
          rows={2}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="isPublic" defaultChecked className="h-4 w-4 rounded border-border" />
        {dict.communities.publicLabel}
      </label>
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.communities.createButton}
      </button>
    </form>
  );
}

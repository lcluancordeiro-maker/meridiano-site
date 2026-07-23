"use client";

import { useActionState } from "react";
import { createLive } from "@/app/actions/lives";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateLiveForm({
  myCommunities,
  isPremium,
}: {
  myCommunities: { id: string; name: string }[];
  isPremium: boolean;
}) {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(createLive, undefined);

  if (!isPremium) {
    return <p className="text-sm text-muted">{dict.lives.premiumRequired}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="live-title" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.lives.titleLabel}
        </label>
        <input
          id="live-title"
          name="title"
          type="text"
          required
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {myCommunities.length > 0 && (
        <div>
          <label htmlFor="live-community" className="mb-1.5 block text-sm font-medium text-foreground">
            {dict.lives.communityLabel}
          </label>
          <select
            id="live-community"
            name="communityId"
            defaultValue=""
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">{dict.lives.noCommunityOption}</option>
            {myCommunities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {state?.error && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.lives.startButton}
      </button>
    </form>
  );
}

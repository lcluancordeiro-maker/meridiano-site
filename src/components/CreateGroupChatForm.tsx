"use client";

import { useActionState } from "react";
import { createGroupConversation } from "@/app/actions/chat";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CreateGroupChatForm() {
  const { dict } = useTranslation();
  const [state, formAction, pending] = useActionState(createGroupConversation, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="group-title" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.chat.groupTitleLabel}
        </label>
        <input
          id="group-title"
          name="title"
          type="text"
          required
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="group-emails" className="mb-1.5 block text-sm font-medium text-foreground">
          {dict.chat.groupEmailsLabel}
        </label>
        <input
          id="group-emails"
          name="emails"
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
        {dict.chat.createGroupButton}
      </button>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { unblockUser } from "@/app/actions/moderation";
import { useTranslation } from "@/i18n/LanguageContext";

type BlockedUser = { blocked_id: string; display_name: string };

export default function BlockedUsersList({ initialBlockedUsers }: { initialBlockedUsers: BlockedUser[] }) {
  const { dict } = useTranslation();
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);
  const [pending, startTransition] = useTransition();

  function handleUnblock(userId: string) {
    startTransition(async () => {
      await unblockUser(userId);
      setBlockedUsers((prev) => prev.filter((u) => u.blocked_id !== userId));
    });
  }

  if (blockedUsers.length === 0) {
    return <p className="text-sm text-muted">{dict.chat.blockedUsersEmpty}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {blockedUsers.map((u) => (
        <li
          key={u.blocked_id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
        >
          <span className="text-sm text-foreground">{u.display_name}</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleUnblock(u.blocked_id)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.chat.unblockButton}
          </button>
        </li>
      ))}
    </ul>
  );
}

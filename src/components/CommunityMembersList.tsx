"use client";

import { useState, useTransition } from "react";
import { leaveCommunity, removeCommunityMember } from "@/app/actions/moderation";
import { useTranslation } from "@/i18n/LanguageContext";

type Member = { user_id: string; display_name: string; role: string };

export default function CommunityMembersList({
  communityId,
  currentUserId,
  isOwner,
  initialMembers,
}: {
  communityId: string;
  currentUserId: string;
  isOwner: boolean;
  initialMembers: Member[];
}) {
  const { dict } = useTranslation();
  const [members, setMembers] = useState(initialMembers);
  const [pending, startTransition] = useTransition();

  function handleRemove(userId: string) {
    startTransition(async () => {
      await removeCommunityMember(communityId, userId);
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    });
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {members.map((m) => (
          <li
            key={m.user_id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          >
            <span>
              {m.display_name}
              {m.role === "owner" && <span className="ml-1 text-xs text-muted">★</span>}
            </span>
            {isOwner && m.user_id !== currentUserId && (
              <button
                type="button"
                disabled={pending}
                onClick={() => handleRemove(m.user_id)}
                className="text-xs text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dict.communities.removeMemberButton}
              </button>
            )}
          </li>
        ))}
      </ul>

      {!isOwner && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => leaveCommunity(communityId))}
          className="mt-3 self-start text-sm text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.communities.leaveCommunityButton}
        </button>
      )}
    </>
  );
}

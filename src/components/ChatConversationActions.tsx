"use client";

import { useTransition } from "react";
import { blockUser, leaveGroupConversation, removeConversationParticipant } from "@/app/actions/moderation";
import { useTranslation } from "@/i18n/LanguageContext";

type Participant = { user_id: string; display_name: string };

export default function ChatConversationActions({
  conversationId,
  currentUserId,
  isGroup,
  createdBy,
  participants,
}: {
  conversationId: string;
  currentUserId: string;
  isGroup: boolean;
  createdBy: string;
  participants: Participant[];
}) {
  const { dict } = useTranslation();
  const [pending, startTransition] = useTransition();

  if (!isGroup) {
    const peer = participants.find((p) => p.user_id !== currentUserId);
    if (!peer) return null;
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => blockUser(peer.user_id, conversationId))}
        className="mb-4 self-start text-sm text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.chat.blockButton}
      </button>
    );
  }

  const isOwner = createdBy === currentUserId;
  const others = participants.filter((p) => p.user_id !== currentUserId);

  return (
    <div className="mb-4 flex flex-col gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => leaveGroupConversation(conversationId))}
        className="self-start text-sm text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.chat.leaveGroupButton}
      </button>

      {isOwner && others.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">{dict.chat.manageMembersHeading}</h2>
          <ul className="flex flex-col gap-1">
            {others.map((p) => (
              <li key={p.user_id} className="flex items-center justify-between text-sm text-foreground">
                <span>{p.display_name}</span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => removeConversationParticipant(conversationId, p.user_id))}
                  className="text-xs text-error hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {dict.chat.removeMemberButton}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

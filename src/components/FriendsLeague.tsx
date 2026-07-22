"use client";

import { useActionState, useState, useTransition } from "react";
import { acceptFriendRequest, removeFriendConnection, sendFriendRequest } from "@/app/actions/friends";

type PendingRequest = { connection_id: string; other_display_name: string; direction: "enviado" | "recebido" };
type FriendRow = { display_name: string; weekly_xp: number; rank: number; is_me: boolean };

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Hardcoded Portuguese — same convention as other recently-added
// interactive controls (ReportContentButton.tsx) that ship before full
// 15-locale i18n; the surrounding /liga page is already translated, but
// this section is new enough to follow the lighter-weight precedent.
export default function FriendsLeague({
  initialPendingRequests,
  friendsLeaderboard,
}: {
  initialPendingRequests: PendingRequest[];
  friendsLeaderboard: FriendRow[];
}) {
  const [state, formAction, pending] = useActionState(sendFriendRequest, undefined);
  const [requests, setRequests] = useState(initialPendingRequests);
  const [isPending, startTransition] = useTransition();

  function handleAccept(connectionId: string) {
    startTransition(async () => {
      await acceptFriendRequest(connectionId);
      setRequests((prev) => prev.filter((r) => r.connection_id !== connectionId));
    });
  }

  function handleRemove(connectionId: string) {
    startTransition(async () => {
      await removeFriendConnection(connectionId);
      setRequests((prev) => prev.filter((r) => r.connection_id !== connectionId));
    });
  }

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-xl font-semibold text-foreground">Liga de amigos</h2>
      <p className="mt-1 text-sm text-muted">
        Um ranking restrito só entre você e quem você convidar — sem precisar de mais ninguém
        pontuando pra valer a pena.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="friend-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Convidar por e-mail
          </label>
          <input
            id="friend-email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-border px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Convidar
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-error">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-success">{state.success}</p>}

      {requests.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {requests.map((request) => (
            <li
              key={request.connection_id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm"
            >
              <span className="text-foreground">
                {request.direction === "recebido"
                  ? `${request.other_display_name} quer ser seu amigo`
                  : `Convite enviado para ${request.other_display_name}`}
              </span>
              <span className="flex gap-2">
                {request.direction === "recebido" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleAccept(request.connection_id)}
                    className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
                  >
                    Aceitar
                  </button>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRemove(request.connection_id)}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted hover:border-error hover:text-error"
                >
                  {request.direction === "recebido" ? "Recusar" : "Cancelar"}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {friendsLeaderboard.length <= 1 ? (
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Convide um amigo para começar sua liga.
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {friendsLeaderboard.map((row) => (
              <li
                key={`${row.rank}-${row.display_name}`}
                className={`flex items-center justify-between rounded-xl border p-3 ${
                  row.is_me ? "border-primary bg-primary/5" : "border-border bg-surface"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-8 text-center font-display text-sm font-semibold text-muted">
                    {MEDALS[row.rank] ?? `${row.rank}º`}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {row.display_name}
                    {row.is_me && " (você)"}
                  </span>
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {row.weekly_xp} XP
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

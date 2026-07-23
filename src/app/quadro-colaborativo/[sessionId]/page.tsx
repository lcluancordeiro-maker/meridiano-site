import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import CollabBoard from "@/components/CollabBoard";
import { joinCollabBoardSession } from "@/app/actions/collabBoard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CollabBoardSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const locale = await getServerLocale();
  const { collabBoard: dict, auth } = getDictionary(locale);

  // Checked before touching Supabase directly, same priority order as the
  // entry page (/quadro-colaborativo): getSocialAccessStatus already folds
  // in "is Supabase itself configured" (not just identity verification), so
  // this is the single source of truth for both pages' gating.
  const status = isSupabaseConfigured ? await getSocialAccessStatus() : "not_configured";

  if (status === "not_configured") {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.notConfigured}</p>
        </div>
      </div>
    );
  }

  if (status === "logged_out") {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.requiresLogin}{" "}
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              {auth.entrarLink}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (status !== "granted") {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.requiresVerification}{" "}
            <Link href="/verificar-identidade" className="font-semibold text-primary hover:underline">
              {dict.verifyLink}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.notConfigured}</p>
        </div>
      </div>
    );
  }

  const { data: session } = await supabase
    .from("collab_board_sessions")
    .select("id, canvas_data_url")
    .eq("id", sessionId)
    .maybeSingle();

  const { data: participants } = await supabase
    .from("collab_board_participants")
    .select("user_id, display_name")
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true });

  const isParticipant = (participants ?? []).some((p) => p.user_id === user.id);

  if (!isParticipant) {
    const joinResult = await joinCollabBoardSession(sessionId);
    if (joinResult?.error) {
      return (
        <div className="flex flex-1 flex-col">
          <Navbar />
          <div className="mx-auto w-full max-w-2xl px-6 py-16">
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              {session ? joinResult.error : dict.notFoundOrNoAccess}
            </p>
          </div>
        </div>
      );
    }
  }

  if (!session) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.notFoundOrNoAccess}</p>
        </div>
      </div>
    );
  }

  // The join above (when needed) may have added a new participant row after
  // the select above ran — re-fetch so the initial participant list the
  // client renders already includes whoever just joined, this request.
  const { data: freshParticipants } = await supabase
    .from("collab_board_participants")
    .select("user_id, display_name")
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true });

  const host = (await headers()).get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const shareUrl = `${protocol}://${host}/quadro-colaborativo/${sessionId}`;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="mb-6 font-display text-3xl font-semibold text-foreground">{dict.title}</h1>
        <CollabBoard
          sessionId={session.id}
          currentUserId={user.id}
          initialCanvasDataUrl={session.canvas_data_url}
          initialParticipants={freshParticipants ?? []}
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
}

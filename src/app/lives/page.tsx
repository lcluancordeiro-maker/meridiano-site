import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateLiveForm from "@/components/CreateLiveForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus, isPremiumUser, type SocialAccessStatus } from "@/lib/entitlements";
import { isLiveKitConfigured } from "@/lib/livekit/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

type LiveRow = { id: string; room_name: string; title: string; host_id: string };

export default async function LivesPage() {
  const locale = await getServerLocale();
  const { lives: dict, auth, identity } = getDictionary(locale);

  const liveConfigured = isSupabaseConfigured && isLiveKitConfigured;
  const supabase = liveConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const status: SocialAccessStatus = liveConfigured ? await getSocialAccessStatus() : "not_configured";
  const gated = status !== "granted";

  let activeLives: LiveRow[] = [];
  let myCommunities: { id: string; name: string }[] = [];
  let isPremium = false;

  if (!gated && supabase && user) {
    isPremium = await isPremiumUser();

    const { data } = await supabase
      .from("live_sessions")
      .select("id, room_name, title, host_id")
      .is("ended_at", null)
      .order("started_at", { ascending: false });
    activeLives = (data as LiveRow[] | null) ?? [];

    const { data: memberships } = await supabase.from("community_members").select("community_id").eq("user_id", user.id);
    const myIds = (memberships ?? []).map((m) => m.community_id as string);
    if (myIds.length > 0) {
      const { data: communities } = await supabase.from("communities").select("id, name").in("id", myIds);
      myCommunities = (communities as { id: string; name: string }[] | null) ?? [];
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{dict.title}</h1>

        {status === "not_configured" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.notConfigured}</p>
        )}

        {status === "logged_out" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.requiresLogin}{" "}
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              {auth.entrarLink}
            </Link>
          </p>
        )}

        {status !== "not_configured" && status !== "logged_out" && status !== "granted" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.requiresVerification}{" "}
            <Link href="/verificar-identidade" className="font-semibold text-primary hover:underline">
              {dict.verifyLink}
            </Link>
            {status === "pending" && <> — {identity.pendingMessage}</>}
            {status === "needs_parental_consent" && <> — {identity.minorHeading}</>}
          </p>
        )}

        {!gated && user && (
          <>
            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.activeHeading}</h2>
              {activeLives.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-3">
                  {activeLives.map((live) => (
                    <li key={live.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{live.title}</p>
                        {live.host_id === user.id && <span className="text-xs text-muted">{dict.hostBadge}</span>}
                      </div>
                      <Link
                        href={`/lives/${live.room_name}`}
                        className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                      >
                        {dict.joinButton}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{dict.noActiveLives}</p>
              )}
            </section>

            <section className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.createHeading}</h2>
              <div className="mt-3">
                <CreateLiveForm myCommunities={myCommunities} isPremium={isPremium} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

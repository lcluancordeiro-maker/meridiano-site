import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import JoinCommunityForm from "@/components/JoinCommunityForm";
import { joinCommunityByCode } from "@/app/actions/communities";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

type CommunityRow = { id: string; name: string; description: string | null; join_code: string; is_public: boolean };

export default async function ComunidadesPage() {
  const locale = await getServerLocale();
  const { communities: dict, auth, identity } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const status = await getSocialAccessStatus();
  const gated = status !== "granted";

  let myCommunities: CommunityRow[] = [];
  let publicCommunities: CommunityRow[] = [];

  if (!gated && supabase && user) {
    const { data: memberships } = await supabase.from("community_members").select("community_id").eq("user_id", user.id);
    const myIds = (memberships ?? []).map((m) => m.community_id as string);

    if (myIds.length > 0) {
      const { data } = await supabase
        .from("communities")
        .select("id, name, description, join_code, is_public")
        .in("id", myIds);
      myCommunities = (data as CommunityRow[]) ?? [];
    }

    const { data: publicData } = await supabase
      .from("communities")
      .select("id, name, description, join_code, is_public")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20);
    publicCommunities = ((publicData as CommunityRow[]) ?? []).filter((c) => !myIds.includes(c.id));
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

        {status === "banned" && (
          <p className="mt-8 rounded-xl border border-error bg-error-bg p-4 text-sm text-error">
            {identity.bannedMessage}
          </p>
        )}

        {status !== "not_configured" && status !== "logged_out" && status !== "granted" && status !== "banned" && (
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
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.myCommunitiesHeading}</h2>
              {myCommunities.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-3">
                  {myCommunities.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                      <div>
                        <p className="font-semibold text-foreground">{c.name}</p>
                        {c.description && <p className="text-xs text-muted">{c.description}</p>}
                      </div>
                      <Link
                        href={`/comunidades/${c.id}`}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                      >
                        {dict.viewButton}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{dict.noCommunitiesYet}</p>
              )}
            </section>

            <section className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.createHeading}</h2>
              <div className="mt-3">
                <CreateCommunityForm />
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.joinHeading}</h2>
              <div className="mt-3">
                <JoinCommunityForm />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-lg font-semibold text-foreground">{dict.discoverHeading}</h2>
              {publicCommunities.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-3">
                  {publicCommunities.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                      <div>
                        <p className="font-semibold text-foreground">{c.name}</p>
                        {c.description && <p className="text-xs text-muted">{c.description}</p>}
                      </div>
                      <form action={joinCommunityByCode.bind(null, c.join_code)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                        >
                          {dict.joinButton}
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{dict.noPublicCommunities}</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

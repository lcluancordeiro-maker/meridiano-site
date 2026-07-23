import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CommunityThread from "@/components/CommunityThread";
import CommunityMembersList from "@/components/CommunityMembersList";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ComunidadeDetailPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = await params;
  const locale = await getServerLocale();
  const { communities: dict } = getDictionary(locale);

  if (!isSupabaseConfigured) redirect("/comunidades");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/comunidades");

  const status = await getSocialAccessStatus();
  if (status !== "granted") redirect("/verificar-identidade");

  const { data: community } = await supabase
    .from("communities")
    .select("id, name, description, join_code, creator_id")
    .eq("id", communityId)
    .maybeSingle();

  if (!community) notFound();

  const [{ data: members }, { data: messages }] = await Promise.all([
    supabase.rpc("get_community_members", { p_community_id: communityId }),
    supabase
      .from("community_messages")
      .select("id, sender_id, body, created_at")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true }),
  ]);

  const memberRows = (members as { user_id: string; display_name: string | null; role: string }[] | null) ?? [];
  const memberNames: Record<string, string> = {};
  for (const m of memberRows) memberNames[m.user_id] = m.display_name ?? "?";

  const isMember = memberRows.some((m) => m.user_id === user.id);
  if (!isMember) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <Link href="/comunidades" className="mb-4 text-sm text-muted hover:text-foreground">
          {dict.backToCommunities}
        </Link>
        <h1 className="font-display text-2xl font-semibold text-foreground">{community.name}</h1>
        {community.description && <p className="mt-1 text-muted">{community.description}</p>}
        {community.creator_id === user.id && (
          <p className="mt-1 text-xs text-muted">
            {dict.codeLabel}: <span className="font-mono">{community.join_code}</span>
          </p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <section className="sm:col-span-2 flex flex-col">
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">{dict.chatHeading}</h2>
            <CommunityThread
              communityId={communityId}
              currentUserId={user.id}
              initialMessages={messages ?? []}
              memberNames={memberNames}
            />
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              {dict.membersHeading} ({memberRows.length})
            </h2>
            <CommunityMembersList
              communityId={communityId}
              currentUserId={user.id}
              isOwner={community.creator_id === user.id}
              initialMembers={memberRows.map((m) => ({ user_id: m.user_id, display_name: m.display_name ?? "?", role: m.role }))}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

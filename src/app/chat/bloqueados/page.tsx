import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import BlockedUsersList from "@/components/BlockedUsersList";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function BlockedUsersPage() {
  const locale = await getServerLocale();
  const { chat } = getDictionary(locale);

  if (!isSupabaseConfigured) redirect("/chat");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/chat");

  const status = await getSocialAccessStatus();
  if (status !== "granted") redirect("/verificar-identidade");

  const { data } = await supabase.rpc("get_blocked_users");
  const blockedUsers = ((data as { blocked_id: string; display_name: string | null }[] | null) ?? []).map((b) => ({
    blocked_id: b.blocked_id,
    display_name: b.display_name ?? "?",
  }));

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <Link href="/chat" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
          {chat.backToChat}
        </Link>
        <h1 className="mb-6 font-display text-3xl font-semibold text-foreground">{chat.blockedUsersHeading}</h1>
        <BlockedUsersList initialBlockedUsers={blockedUsers} />
      </div>
    </div>
  );
}

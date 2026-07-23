import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveRoom from "@/components/LiveRoom";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { isLiveKitConfigured } from "@/lib/livekit/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LiveDetailPage({ params }: { params: Promise<{ roomName: string }> }) {
  const { roomName } = await params;
  const locale = await getServerLocale();
  const { lives: dict } = getDictionary(locale);

  const liveConfigured = isSupabaseConfigured && isLiveKitConfigured;
  if (!liveConfigured) redirect("/lives");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/lives");

  const status = await getSocialAccessStatus();
  if (status !== "granted") redirect("/verificar-identidade");

  const { data: live } = await supabase
    .from("live_sessions")
    .select("room_name, title, host_id, ended_at")
    .eq("room_name", roomName)
    .maybeSingle();

  if (!live) notFound();

  const isHost = live.host_id === user.id;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <Link href="/lives" className="mb-4 text-sm text-muted hover:text-foreground">
          {dict.backToLives}
        </Link>
        <h1 className="font-display text-2xl font-semibold text-foreground">{live.title}</h1>

        <div className="mt-6 flex flex-1 flex-col">
          {live.ended_at ? (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.liveEnded}</p>
          ) : (
            <LiveRoom roomName={roomName} isHost={isHost} />
          )}
        </div>
      </div>
    </div>
  );
}

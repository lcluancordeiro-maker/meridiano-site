import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ModerationReportsList, { type ModerationReport } from "@/components/ModerationReportsList";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdmin } from "@/lib/entitlements";

export default async function ModeracaoPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/entrar");

  // Not an admin: 404 instead of a "you need to be an admin" message, so the
  // existence of this route/feature isn't disclosed to regular users.
  if (!(await isAdmin())) notFound();

  const { data: reports } = await supabase.rpc("list_message_reports");
  const reportRows = (reports as ModerationReport[] | null) ?? [];

  const senderIds = [...new Set(reportRows.map((r) => r.sender_id).filter((id): id is string => Boolean(id)))];
  let bannedSenderIds: string[] = [];
  if (senderIds.length > 0) {
    const { data: banned } = await supabase.rpc("get_banned_user_ids", { p_user_ids: senderIds });
    bannedSenderIds = ((banned as { user_id: string }[] | null) ?? []).map((b) => b.user_id);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Moderação</h1>
        <p className="mt-2 text-muted">Denúncias de mensagens de chat e comunidades.</p>
        <div className="mt-8">
          <ModerationReportsList initialReports={reportRows} initialBannedSenderIds={bannedSenderIds} />
        </div>
      </div>
    </div>
  );
}

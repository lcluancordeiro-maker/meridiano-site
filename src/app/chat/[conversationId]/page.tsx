import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatThread from "@/components/ChatThread";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ChatConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const locale = await getServerLocale();
  const { chat } = getDictionary(locale);

  if (!isSupabaseConfigured) redirect("/chat");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/chat");

  const status = await getSocialAccessStatus();
  if (status !== "granted") redirect("/verificar-identidade");

  const [{ data: header, error: headerError }, { data: participants }, { data: messages }] = await Promise.all([
    supabase.rpc("get_conversation_header", { p_conversation_id: conversationId }),
    supabase.rpc("get_conversation_participants", { p_conversation_id: conversationId }),
    supabase
      .from("dm_messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true }),
  ]);

  if (headerError || !header || (Array.isArray(header) && header.length === 0)) notFound();

  const headerRow = Array.isArray(header) ? header[0] : header;
  const title = headerRow.is_group ? headerRow.title : headerRow.peer_display_name ?? "?";

  const participantNames: Record<string, string> = {};
  for (const p of (participants as { user_id: string; display_name: string | null }[] | null) ?? []) {
    participantNames[p.user_id] = p.display_name ?? "?";
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        <Link href="/chat" className="mb-4 text-sm text-muted hover:text-foreground">
          {chat.backToChat}
        </Link>
        <h1 className="mb-4 font-display text-2xl font-semibold text-foreground">{title}</h1>
        <ChatThread
          conversationId={conversationId}
          currentUserId={user.id}
          initialMessages={messages ?? []}
          participantNames={participantNames}
        />
      </div>
    </div>
  );
}

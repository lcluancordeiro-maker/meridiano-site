import Link from "next/link";
import Navbar from "@/components/Navbar";
import StartDirectChatForm from "@/components/StartDirectChatForm";
import CreateGroupChatForm from "@/components/CreateGroupChatForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

type ConversationRow = {
  conversation_id: string;
  is_group: boolean;
  title: string | null;
  peer_display_name: string | null;
  last_message_body: string | null;
  last_message_at: string | null;
};

export default async function ChatPage() {
  const locale = await getServerLocale();
  const { chat, auth, identity } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const status = await getSocialAccessStatus();

  const gated = status !== "granted";

  const conversations =
    !gated && supabase ? ((await supabase.rpc("list_my_conversations")).data as ConversationRow[] | null) ?? [] : [];

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-foreground">{chat.title}</h1>
          {!gated && user && (
            <Link href="/chat/bloqueados" className="text-sm text-muted hover:text-foreground">
              {chat.blockedUsersHeading}
            </Link>
          )}
        </div>

        {status === "not_configured" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">{chat.notConfigured}</p>
        )}

        {status === "logged_out" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {chat.requiresLogin}{" "}
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
            {chat.requiresVerification}{" "}
            <Link href="/verificar-identidade" className="font-semibold text-primary hover:underline">
              {chat.verifyLink}
            </Link>
            {status === "pending" && <> — {identity.pendingMessage}</>}
            {status === "needs_parental_consent" && <> — {identity.minorHeading}</>}
          </p>
        )}

        {!gated && user && (
          <>
            <section className="mt-10">
              {conversations.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {conversations.map((c) => (
                    <li
                      key={c.conversation_id}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {c.is_group ? c.title : c.peer_display_name ?? "?"}
                        </p>
                        {c.last_message_body && <p className="truncate text-xs text-muted">{c.last_message_body}</p>}
                      </div>
                      <Link
                        href={`/chat/${c.conversation_id}`}
                        className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                      >
                        {chat.openButton}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">{chat.noConversations}</p>
              )}
            </section>

            <section className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{chat.newConversationHeading}</h2>
              <div className="mt-3">
                <StartDirectChatForm />
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{chat.newGroupHeading}</h2>
              <div className="mt-3">
                <CreateGroupChatForm />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

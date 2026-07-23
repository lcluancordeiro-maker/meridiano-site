import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateCollabBoardForm from "@/components/CreateCollabBoardForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus, type SocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CollabBoardEntryPage() {
  const locale = await getServerLocale();
  const { collabBoard: dict, auth, identity } = getDictionary(locale);

  const status: SocialAccessStatus = isSupabaseConfigured ? await getSocialAccessStatus() : "not_configured";
  const gated = status !== "granted";

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{dict.title}</h1>
        <p className="mt-2 text-sm text-muted">{dict.entryDescription}</p>

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
          <p className="mt-8 rounded-xl border border-error bg-error-bg p-4 text-sm text-error">{identity.bannedMessage}</p>
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

        {!gated && (
          <div className="mt-8">
            <CreateCollabBoardForm />
          </div>
        )}
      </div>
    </div>
  );
}

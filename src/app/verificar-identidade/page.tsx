import Link from "next/link";
import Navbar from "@/components/Navbar";
import IdentityVerificationButton from "@/components/IdentityVerificationButton";
import ParentalConsentForm from "@/components/ParentalConsentForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function VerificarIdentidadePage() {
  const locale = await getServerLocale();
  const { identity, auth } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const status = await getSocialAccessStatus();

  let consentSentTo: string | null = null;
  if (status === "needs_parental_consent" && supabase && user) {
    const { data } = await supabase.from("parent_consents").select("parent_email").eq("user_id", user.id).maybeSingle();
    consentSentTo = (data?.parent_email as string | undefined) ?? null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{identity.pageTitle}</h1>
        <p className="mt-2 text-muted">{identity.pageSubtitle}</p>

        <div className="mt-8">
          {status === "not_configured" && (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{identity.notConfigured}</p>
          )}

          {status === "logged_out" && (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              {identity.requiresLogin}{" "}
              <Link href="/entrar" className="font-semibold text-primary hover:underline">
                {auth.entrarLink}
              </Link>
            </p>
          )}

          {(status === "unverified" || status === "failed") && (
            <div className="flex flex-col gap-3">
              {status === "failed" && <p className="rounded-xl bg-error-bg p-4 text-sm text-error">{identity.failedMessage}</p>}
              <IdentityVerificationButton label={status === "failed" ? identity.retryButton : identity.startButton} />
            </div>
          )}

          {status === "pending" && (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{identity.pendingMessage}</p>
          )}

          {status === "needs_parental_consent" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-warning bg-warning-bg p-4">
                <p className="font-semibold text-warning">{identity.minorHeading}</p>
                <p className="mt-1 text-sm text-warning">{identity.minorBody}</p>
              </div>
              {consentSentTo ? (
                <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
                  {identity.consentPendingMessage} ({consentSentTo})
                </p>
              ) : (
                <ParentalConsentForm />
              )}
            </div>
          )}

          {status === "granted" && (
            <p className="rounded-xl border border-success bg-success-bg p-4 text-sm font-semibold text-success">
              {identity.grantedMessage}
            </p>
          )}

          {status === "banned" && (
            <p className="rounded-xl border border-error bg-error-bg p-4 text-sm text-error">{identity.bannedMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import SubscriptionActionButton from "@/components/SubscriptionActionButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isStripeConfigured } from "@/lib/stripe/config";
import { isPremiumUser } from "@/lib/entitlements";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function AssinaturaPage() {
  const locale = await getServerLocale();
  const { premium, auth } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const isPremium = user ? await isPremiumUser() : false;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{premium.pageTitle}</h1>
        <p className="mt-2 text-muted">{premium.pageSubtitle}</p>

        <ul className="mt-8 flex flex-col gap-3 text-sm text-foreground">
          <li className="flex gap-2">
            <span aria-hidden>✓</span> {premium.benefit1}
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✓</span> {premium.benefit2}
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✓</span> {premium.benefit3}
          </li>
        </ul>

        <p className="mt-6 text-xs text-muted">{premium.paymentMethods}</p>

        <div className="mt-8">
          {!isSupabaseConfigured || !isStripeConfigured ? (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              {premium.notConfigured}
            </p>
          ) : !user ? (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              {premium.requiresLogin}{" "}
              <Link href="/entrar" className="font-semibold text-primary hover:underline">
                {auth.entrarLink}
              </Link>
            </p>
          ) : isPremium ? (
            <div className="flex flex-col gap-4">
              <p className="rounded-xl border border-success bg-success-bg p-4 text-sm font-semibold text-success">
                {premium.activeStatus}
              </p>
              <SubscriptionActionButton endpoint="/api/stripe/portal" label={premium.manageButton} />
            </div>
          ) : (
            <SubscriptionActionButton endpoint="/api/stripe/checkout" label={premium.subscribeButton} />
          )}
        </div>
      </div>
    </div>
  );
}

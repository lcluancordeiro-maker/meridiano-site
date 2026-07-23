import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import OAuthButtons from "@/components/OAuthButtons";
import PasskeyLoginButton from "@/components/PasskeyLoginButton";
import { login } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const locale = await getServerLocale();
  const { auth } = getDictionary(locale);
  const { erro } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{auth.entrarTitle}</h1>
        <p className="mt-2 text-muted">{auth.entrarSubtitle}</p>
        {!isSupabaseConfigured ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {auth.contasIndisponiveis}
          </p>
        ) : (
          <div className="mt-8">
            {erro === "oauth" && (
              <p className="mb-4 rounded-xl bg-error-bg p-3 text-sm text-error">{auth.oauthErro}</p>
            )}
            <div className="mb-3">
              <PasskeyLoginButton label={auth.entrarComBiometria} errorLabel={auth.biometriaErro} />
            </div>
            <div className="mb-6">
              <OAuthButtons dict={auth} />
            </div>
            <AuthForm action={login} mode="login" />
            <p className="mt-4 text-sm text-muted">
              {auth.naoTemConta}{" "}
              <Link href="/cadastro" className="font-semibold text-primary hover:underline">
                {auth.criarConta}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

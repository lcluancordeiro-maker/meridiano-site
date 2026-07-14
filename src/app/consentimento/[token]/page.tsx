import Navbar from "@/components/Navbar";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ConsentimentoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const locale = await getServerLocale();
  const { identity } = getDictionary(locale);

  const serviceRole = createServiceRoleClient();
  const confirmed = serviceRole ? (await serviceRole.rpc("confirm_parental_consent", { p_token: token })).data : false;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-xl px-6 py-16 text-center">
        {confirmed ? (
          <>
            <h1 className="font-display text-3xl font-semibold text-foreground">{identity.consentConfirmedTitle}</h1>
            <p className="mt-2 text-muted">{identity.consentConfirmedBody}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold text-foreground">{identity.consentInvalidTitle}</h1>
            <p className="mt-2 text-muted">{identity.consentInvalidBody}</p>
          </>
        )}
      </div>
    </div>
  );
}

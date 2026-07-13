import Navbar from "@/components/Navbar";
import QuadroBoard from "@/components/QuadroBoard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function QuadroPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const locale = await getServerLocale();
  const { quadro } = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{quadro.title}</h1>
        <p className="mt-2 text-muted">{quadro.subtitle}</p>
        <div className="mt-8">
          <QuadroBoard canResolve={Boolean(isSupabaseConfigured && user)} />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import JoinLiveQuizForm from "@/components/JoinLiveQuizForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function JoinLiveQuizPage() {
  const locale = await getServerLocale();
  const { liveQuiz: dict, auth } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{dict.enterTitle}</h1>
        {!isSupabaseConfigured || !user || !supabase ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {!isSupabaseConfigured ? (
              dict.notConfigured
            ) : (
              <>
                {dict.requiresLogin}{" "}
                <Link href="/entrar" className="font-semibold text-primary hover:underline">
                  {auth.entrarLink}
                </Link>
              </>
            )}
          </p>
        ) : (
          <div className="mt-8">
            <JoinLiveQuizForm />
          </div>
        )}
      </div>
    </div>
  );
}

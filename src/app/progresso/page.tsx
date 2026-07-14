import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProgressoContent from "@/components/ProgressoContent";
import NotificationOptIn from "@/components/NotificationOptIn";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ProgressoPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-6 pt-8">
        <NotificationOptIn loggedIn={Boolean(isSupabaseConfigured && user)} />
        <Link
          href="/liga"
          className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary"
        >
          <span>🏆 Liga semanal — compare seu XP da semana com outros estudantes</span>
          <span aria-hidden className="text-primary">→</span>
        </Link>
      </div>
      <ProgressoContent />
    </div>
  );
}

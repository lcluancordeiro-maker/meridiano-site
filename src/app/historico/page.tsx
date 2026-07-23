import Link from "next/link";
import Navbar from "@/components/Navbar";
import HistoricoList from "@/components/HistoricoList";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";
import type { PhotoSolution } from "@/lib/photoSolve";

type ConversationRow = { id: string; title: string; updated_at: string };
type PhotoHistoryRow = { id: string; created_at: string } & PhotoSolution;

export default async function HistoricoPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const locale = await getServerLocale();
  const { foto, historico } = getDictionary(locale);

  let conversations: ConversationRow[] = [];
  let photoHistory: PhotoHistoryRow[] = [];

  if (supabase && user) {
    const [conversationsRes, photoHistoryRes] = await Promise.all([
      supabase
        .from("gauss_conversations")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .limit(30),
      supabase
        .from("photo_solve_history")
        .select("id, enunciado, passos, resposta, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    conversations = conversationsRes.data ?? [];
    photoHistory = photoHistoryRes.data ?? [];
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{historico.title}</h1>
        <p className="mt-2 text-muted">{historico.subtitle}</p>

        {!isSupabaseConfigured || !user ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {foto.exclusivo}{" "}
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              {foto.fazerLogin}
            </Link>{" "}
            {foto.ou}{" "}
            <Link href="/cadastro" className="font-semibold text-primary hover:underline">
              {foto.criarUmaConta}
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8">
            <HistoricoList conversations={conversations} photoHistory={photoHistory} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}

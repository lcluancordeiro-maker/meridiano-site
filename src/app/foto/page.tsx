import Link from "next/link";
import Navbar from "@/components/Navbar";
import PhotoSolver from "@/components/PhotoSolver";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function FotoPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const locale = await getServerLocale();
  const { foto } = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{foto.title}</h1>
        <p className="mt-2 text-muted">{foto.subtitle}</p>

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
            <PhotoSolver />
          </div>
        )}
      </div>
    </div>
  );
}

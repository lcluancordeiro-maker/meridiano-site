import Link from "next/link";
import Navbar from "@/components/Navbar";
import PhotoSolver from "@/components/PhotoSolver";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function FotoPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Resolver por foto
        </h1>
        <p className="mt-2 text-muted">
          Tire uma foto de um problema de matemática e receba a solução passo a passo.
        </p>

        {!isSupabaseConfigured || !user ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Essa funcionalidade é exclusiva para quem tem conta.{" "}
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              Fazer login
            </Link>{" "}
            ou{" "}
            <Link href="/cadastro" className="font-semibold text-primary hover:underline">
              criar uma conta
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

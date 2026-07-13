import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function CadastroPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Criar conta</h1>
        <p className="mt-2 text-muted">
          Seu progresso, XP e conquistas passam a ficar salvos na nuvem.
        </p>
        {!isSupabaseConfigured ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Contas ainda não estão disponíveis neste app — volte em breve.
          </p>
        ) : (
          <div className="mt-8">
            <AuthForm action={signup} mode="signup" />
            <p className="mt-4 text-sm text-muted">
              Já tem conta?{" "}
              <Link href="/entrar" className="font-semibold text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { login } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function EntrarPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Entrar</h1>
        <p className="mt-2 text-muted">
          Acesse sua conta para sincronizar seu progresso entre dispositivos.
        </p>
        {!isSupabaseConfigured ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Contas ainda não estão disponíveis neste app — volte em breve.
          </p>
        ) : (
          <div className="mt-8">
            <AuthForm action={login} mode="login" />
            <p className="mt-4 text-sm text-muted">
              Não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DeleteAccountForm from "@/components/DeleteAccountForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ContaPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/entrar");

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Minha conta</h1>
        <p className="mt-1 text-sm text-muted">{user.email}</p>

        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Exportar meus dados</h2>
          <p className="mt-1 text-sm text-muted">
            Baixe um arquivo JSON com tudo que este app guarda sobre você: perfil, progresso, XP, assinatura,
            mensagens que você enviou, turmas e comunidades que você criou ou participa.
          </p>
          <a
            href="/api/account/export"
            className="mt-4 inline-block rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            Baixar meus dados
          </a>
        </section>

        <section className="mt-8 rounded-xl border border-error bg-error-bg p-5">
          <h2 className="font-display text-lg font-semibold text-error">Excluir minha conta</h2>
          <p className="mt-1 text-sm text-foreground/80">
            Isso apaga sua conta e todos os dados associados (perfil, progresso, assinatura, mensagens, turmas e
            comunidades que você criou) permanentemente. Não é possível desfazer.
          </p>
          <div className="mt-4">
            <DeleteAccountForm userEmail={user.email ?? ""} />
          </div>
        </section>

        <Link href="/privacidade" className="mt-6 inline-block text-sm text-muted hover:text-foreground">
          Ver política de privacidade
        </Link>
      </div>
    </div>
  );
}

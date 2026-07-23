import Link from "next/link";
import Navbar from "@/components/Navbar";
import CommunityProblemsList, { type CommunityProblem } from "@/components/CommunityProblemsList";
import { createClient } from "@/lib/supabase/server";
import { getSocialAccessStatus } from "@/lib/entitlements";

export const metadata = {
  title: "Problemas da comunidade",
  description: "Problemas de matemática enviados por outros alunos — envie o seu também.",
};

export default async function ComunidadeProblemasPage() {
  const status = await getSocialAccessStatus();
  const gated = status !== "granted";

  let problems: CommunityProblem[] = [];
  if (!gated) {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.rpc("list_community_problems");
      problems = (data as CommunityProblem[] | null) ?? [];
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Problemas da comunidade
        </h1>
        <p className="mt-2 text-muted">
          Um banco de problemas enviados por outros alunos — resolva, vote nos melhores e envie os
          seus também.
        </p>

        {status === "not_configured" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            O banco de problemas da comunidade ainda não está disponível neste app.
          </p>
        )}

        {status === "logged_out" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Faça login para ver e enviar problemas.{" "}
            <Link href="/entrar" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        )}

        {status === "banned" && (
          <p className="mt-8 rounded-xl border border-error bg-error-bg p-4 text-sm text-error">
            Um moderador restringiu seu acesso aos recursos sociais (chat, comunidades, lives, banco
            de problemas). Isso não afeta o resto do app.
          </p>
        )}

        {status !== "not_configured" && status !== "logged_out" && status !== "granted" && status !== "banned" && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Verifique sua identidade para desbloquear o banco de problemas da comunidade.{" "}
            <Link href="/verificar-identidade" className="font-semibold text-primary hover:underline">
              Verificar identidade
            </Link>
            {status === "pending" && <> — sua verificação está sendo processada — isso pode levar um minuto.</>}
            {status === "needs_parental_consent" && <> — consentimento dos responsáveis necessário.</>}
          </p>
        )}

        {!gated && (
          <div className="mt-8">
            <CommunityProblemsList initialProblems={problems} />
          </div>
        )}
      </div>
    </div>
  );
}

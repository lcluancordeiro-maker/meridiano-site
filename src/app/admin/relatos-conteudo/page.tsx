import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdmin } from "@/lib/entitlements";

type ContentReport = {
  id: string;
  source: "exercicio" | "gauss";
  level_id: string | null;
  topic_id: string | null;
  exercise_id: string | null;
  difficulty: string | null;
  context: string;
  comment: string;
  created_at: string;
};

export default async function RelatosConteudoPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/entrar");

  // Not an admin: 404 instead of a "you need to be an admin" message, same
  // pattern as /admin/moderacao — doesn't disclose the route to regular users.
  if (!(await isAdmin())) notFound();

  const { data } = await supabase
    .from("content_reports")
    .select("id, source, level_id, topic_id, exercise_id, difficulty, context, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const reports = (data as ContentReport[] | null) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Relatos de conteúdo</h1>
        <p className="mt-2 text-muted">
          Erros que alunos sinalizaram em exercícios ou em respostas do Gauss/resolver por foto.
        </p>

        {reports.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Nenhum relato ainda.
          </p>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {reports.map((report) => (
              <li key={report.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {report.source === "exercicio" ? "Exercício" : "Gauss / Resolver por foto"}
                  </span>
                  <span>{new Date(report.created_at).toLocaleString("pt-BR")}</span>
                </div>
                {report.source === "exercicio" ? (
                  <p className="mt-2 text-sm text-foreground">
                    {report.level_id}/{report.topic_id}/{report.exercise_id} ({report.difficulty})
                  </p>
                ) : (
                  report.context && <p className="mt-2 text-sm text-foreground">{report.context}</p>
                )}
                {report.comment && (
                  <p className="mt-1 text-sm text-muted">&ldquo;{report.comment}&rdquo;</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

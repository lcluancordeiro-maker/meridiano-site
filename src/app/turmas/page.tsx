import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateTurmaForm from "@/components/CreateTurmaForm";
import JoinTurmaForm from "@/components/JoinTurmaForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

type TurmaRow = { id: string; name: string; join_code?: string; created_at: string };

export default async function TurmasPage() {
  const locale = await getServerLocale();
  const { turmas: dict, auth } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!isSupabaseConfigured || !user || !supabase) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-foreground">{dict.title}</h1>
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
        </div>
      </div>
    );
  }

  const { data: teaching } = await supabase
    .from("turmas")
    .select("id, name, join_code, created_at")
    .eq("teacher_user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: memberships } = await supabase
    .from("turma_members")
    .select("turma_id")
    .eq("student_user_id", user.id);

  const memberTurmaIds = (memberships ?? []).map((m) => m.turma_id as string);

  const { data: memberOf } = memberTurmaIds.length
    ? await supabase
        .from("turmas")
        .select("id, name, created_at")
        .in("id", memberTurmaIds)
        .order("created_at", { ascending: false })
    : { data: [] as TurmaRow[] };

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">{dict.title}</h1>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-foreground">{dict.teachingHeading}</h2>
          {teaching && teaching.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {(teaching as TurmaRow[]).map((turma) => (
                <li
                  key={turma.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">{turma.name}</p>
                    <p className="text-xs text-muted">
                      {dict.joinCodePrefix}: <span className="font-mono">{turma.join_code}</span>
                    </p>
                  </div>
                  <Link
                    href={`/turmas/${turma.id}`}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    {dict.viewButton}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">{dict.noTurmasTeaching}</p>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">{dict.createHeading}</h2>
          <div className="mt-3">
            <CreateTurmaForm />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold text-foreground">{dict.memberHeading}</h2>
          {memberOf && memberOf.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {(memberOf as TurmaRow[]).map((turma) => (
                <li
                  key={turma.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-semibold text-foreground">{turma.name}</p>
                  <Link
                    href={`/turmas/${turma.id}`}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    {dict.viewButton}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">{dict.noTurmasMember}</p>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">{dict.joinHeading}</h2>
          <div className="mt-3">
            <JoinTurmaForm />
          </div>
        </section>
      </div>
    </div>
  );
}

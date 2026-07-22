import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import TurmaPerformanceMatrix from "@/components/TurmaPerformanceMatrix";
import TurmaAiUsage from "@/components/TurmaAiUsage";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLevel, getTopic, DIFFICULTY_LABELS, type Difficulty } from "@/data/curriculum";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

type RosterRow = { student_user_id: string; display_name: string | null; xp: number; streak_current: number };
type TurmaLeaderboardRow = { display_name: string; weekly_xp: number; rank: number };
type AssignmentRow = { id: string; level_id: string; topic_id: string; difficulty: Difficulty };
type AiUsageRow = {
  student_user_id: string;
  display_name: string | null;
  tutor_messages: number;
  photos_resolved: number;
  last_ai_activity: string | null;
};

export default async function TurmaDetailPage({
  params,
}: {
  params: Promise<{ turmaId: string }>;
}) {
  const { turmaId } = await params;
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

  const { data: turma } = await supabase
    .from("turmas")
    .select("id, name, teacher_user_id, join_code")
    .eq("id", turmaId)
    .maybeSingle();

  if (!turma) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <Link href="/turmas" className="text-sm font-medium text-primary hover:underline">
            {dict.backToTurmas}
          </Link>
          <p className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            {dict.notFoundOrNoAccess}
          </p>
        </div>
      </div>
    );
  }

  const isTeacher = turma.teacher_user_id === user.id;

  const { data: assignments } = await supabase
    .from("turma_assignments")
    .select("id, level_id, topic_id, difficulty")
    .eq("turma_id", turmaId)
    .order("created_at", { ascending: false });

  const roster = isTeacher
    ? (await supabase.rpc("get_turma_roster", { p_turma_id: turmaId })).data
    : null;

  const aiUsage = isTeacher
    ? (await supabase.rpc("get_turma_ai_usage", { p_turma_id: turmaId })).data
    : null;

  // Only students see this — the teacher isn't a turma_members row, so
  // get_turma_leaderboard's membership check would reject them anyway, and
  // they already have the fuller roster view (XP + streak, not weekly-only).
  const turmaLeaderboard = !isTeacher
    ? (await supabase.rpc("get_turma_leaderboard", { p_turma_id: turmaId })).data
    : null;

  const progressByAssignment: Record<string, { student_user_id: string; score: number | null; total: number | null; completed: boolean | null }[]> = {};
  if (isTeacher && assignments && assignments.length > 0) {
    const progressResults = await Promise.all(
      (assignments as AssignmentRow[]).map((assignment) =>
        supabase.rpc("get_turma_assignment_progress", {
          p_turma_id: turmaId,
          p_level_id: assignment.level_id,
          p_topic_id: assignment.topic_id,
          p_difficulty: assignment.difficulty,
        })
      )
    );
    (assignments as AssignmentRow[]).forEach((assignment, i) => {
      progressByAssignment[assignment.id] = (progressResults[i].data as
        | { student_user_id: string; score: number | null; total: number | null; completed: boolean | null }[]
        | null) ?? [];
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <Link href="/turmas" className="text-sm font-medium text-primary hover:underline">
          {dict.backToTurmas}
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">{turma.name}</h1>

        {isTeacher && (
          <p className="mt-2 text-sm text-muted">
            {dict.joinCodePrefix}: <span className="font-mono font-semibold text-foreground">{turma.join_code}</span>
            {" — "}
            {dict.shareCodeHint}
          </p>
        )}

        {isTeacher && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-foreground">{dict.rosterHeading}</h2>
            {roster && (roster as RosterRow[]).length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {(roster as RosterRow[]).map((student) => (
                  <li
                    key={student.student_user_id}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm"
                  >
                    <span className="font-medium text-foreground">{student.display_name ?? "—"}</span>
                    <span className="text-muted">
                      {dict.xpLabel}: {student.xp} · {dict.streakLabel}: {student.streak_current}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">{dict.noStudents}</p>
            )}
          </section>
        )}

        {isTeacher && aiUsage && (aiUsage as AiUsageRow[]).length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-foreground">{dict.aiUsageHeading}</h2>
            <TurmaAiUsage
              rows={aiUsage as AiUsageRow[]}
              tutorMessagesLabel={dict.tutorMessagesLabel}
              photosResolvedLabel={dict.photosResolvedLabel}
              lastActiveLabel={dict.lastActiveLabel}
              neverUsedAi={dict.neverUsedAi}
              locale={locale}
            />
          </section>
        )}

        {!isTeacher && turmaLeaderboard && (turmaLeaderboard as TurmaLeaderboardRow[]).length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-foreground">Liga da turma</h2>
            <p className="mt-1 text-sm text-muted">Ranking do XP ganho nesta semana pelos colegas de turma.</p>
            <ol className="mt-3 flex flex-col gap-2">
              {(turmaLeaderboard as TurmaLeaderboardRow[]).map((row) => (
                <li
                  key={`${row.rank}-${row.display_name}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 text-center font-display font-semibold text-muted">{row.rank}º</span>
                    <span className="font-medium text-foreground">{row.display_name}</span>
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {row.weekly_xp} XP
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {isTeacher ? dict.assignmentsHeading : dict.studentAssignmentsHeading}
          </h2>
          {assignments && assignments.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {(assignments as AssignmentRow[]).map((assignment) => {
                const level = getLevel(assignment.level_id);
                const topic = getTopic(assignment.level_id, assignment.topic_id);
                return (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{topic?.title ?? assignment.topic_id}</p>
                      <p className="text-xs text-muted">
                        {level?.name} · {DIFFICULTY_LABELS[assignment.difficulty]}
                      </p>
                    </div>
                    {!isTeacher && (
                      <Link
                        href={`/trilha/${assignment.level_id}/${assignment.topic_id}`}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                      >
                        {dict.practiceLink}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">{dict.noAssignments}</p>
          )}
        </section>

        {isTeacher && assignments && assignments.length > 0 && roster && (roster as RosterRow[]).length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-foreground">{dict.performanceHeading}</h2>
            <div className="mt-3">
              <TurmaPerformanceMatrix
                assignments={assignments as AssignmentRow[]}
                students={(roster as RosterRow[]).map((r) => ({
                  student_user_id: r.student_user_id,
                  display_name: r.display_name,
                }))}
                progressByAssignment={progressByAssignment}
                notAttemptedLabel={dict.notAttemptedLabel}
                studentColumnLabel={dict.studentColumnLabel}
              />
            </div>
          </section>
        )}

        {isTeacher && (
          <section className="mt-8 rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {dict.createAssignmentHeading}
            </h2>
            <div className="mt-3">
              <CreateAssignmentForm turmaId={turma.id} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

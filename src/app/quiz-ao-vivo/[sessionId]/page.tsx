import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveQuizRoom from "@/components/LiveQuizRoom";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LiveQuizSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const locale = await getServerLocale();
  const { liveQuiz: dict, auth } = getDictionary(locale);

  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!isSupabaseConfigured || !user || !supabase) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
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

  const { data: session } = await supabase
    .from("live_quiz_sessions")
    .select(
      "id, turma_id, host_user_id, join_code, status, current_question_index, question_started_at, question_seconds, question_ids"
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.notFoundOrNoAccess}</p>
        </div>
      </div>
    );
  }

  const isHost = session.host_user_id === user.id;

  if (!isHost) {
    const { data: participant } = await supabase
      .from("live_quiz_participants")
      .select("student_user_id")
      .eq("session_id", sessionId)
      .eq("student_user_id", user.id)
      .maybeSingle();
    if (!participant) redirect("/quiz-ao-vivo/entrar");
  }

  const { data: turma } = await supabase.from("turmas").select("name").eq("id", session.turma_id).maybeSingle();
  const { data: participants } = await supabase
    .from("live_quiz_participants")
    .select("student_user_id, display_name, score")
    .eq("session_id", sessionId)
    .order("score", { ascending: false });

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <LiveQuizRoom
        sessionId={session.id}
        isHost={isHost}
        currentUserId={user.id}
        turmaId={session.turma_id}
        turmaName={turma?.name ?? ""}
        joinCode={isHost ? session.join_code : null}
        questionSeconds={session.question_seconds}
        totalQuestions={(session.question_ids as string[]).length}
        initialSession={{
          status: session.status,
          currentQuestionIndex: session.current_question_index,
          questionStartedAt: session.question_started_at,
        }}
        initialParticipants={participants ?? []}
      />
    </div>
  );
}

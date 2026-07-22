"use server";

import { getAuthedSupabase } from "@/lib/actionAuth";

export type ReportSource = "exercicio" | "gauss";

export type ReportContentInput = {
  source: ReportSource;
  levelId?: string;
  topicId?: string;
  exerciseId?: string;
  difficulty?: string;
  context?: string;
  comment?: string;
};

/** Records a student-flagged content issue for later manual review — see
 * content_reports in supabase/schema.sql. Not a moderation action (that's
 * message_reports); this is "something here looks wrong," reviewed by
 * whoever maintains the curriculum/prompts, not by the community
 * moderation tooling. */
export async function reportContent(input: ReportContentInput): Promise<{ ok: boolean }> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { ok: false };
  const { supabase, user } = auth;

  const { error } = await supabase.from("content_reports").insert({
    user_id: user.id,
    source: input.source,
    level_id: input.levelId ?? null,
    topic_id: input.topicId ?? null,
    exercise_id: input.exerciseId ?? null,
    difficulty: input.difficulty ?? null,
    context: input.context ?? "",
    comment: input.comment ?? "",
  });

  return { ok: !error };
}

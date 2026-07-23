"use server";

import { redirect } from "next/navigation";
import { getAuthedSupabase } from "@/lib/actionAuth";
import { getSocialAccessStatus } from "@/lib/entitlements";

export type CollabBoardFormState = { error?: string } | undefined;
export type SaveSnapshotResult = { error?: string } | undefined;

const NOT_CONFIGURED_ERROR: CollabBoardFormState = { error: "Quadro colaborativo ainda não está disponível neste app." };
const NOT_GRANTED_ERROR: CollabBoardFormState = { error: "Verifique sua identidade antes de usar o quadro colaborativo." };

/** Creates a new session and immediately joins its own creator through the
 * same join_collab_board_session RPC everyone else uses — no special-cased
 * insert path for the creator, so the 2-participant cap is enforced
 * uniformly (the creator counts as slot 1 of 2, same as anyone else). */
export async function createCollabBoardSession(): Promise<CollabBoardFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured" ? NOT_CONFIGURED_ERROR : { error: "Faça login para criar um quadro colaborativo." };
  }
  const { supabase, user } = auth;
  if ((await getSocialAccessStatus()) !== "granted") return NOT_GRANTED_ERROR;

  const { data, error } = await supabase
    .from("collab_board_sessions")
    .insert({ created_by: user.id })
    .select("id")
    .single();
  if (error || !data) return { error: "Não foi possível criar o quadro. Tente novamente." };

  const { error: joinError } = await supabase.rpc("join_collab_board_session", { p_session_id: data.id });
  if (joinError) return { error: "Não foi possível criar o quadro. Tente novamente." };

  redirect(`/quadro-colaborativo/${data.id}`);
}

export async function joinCollabBoardSession(sessionId: string): Promise<CollabBoardFormState> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) {
    return auth.reason === "not-configured" ? NOT_CONFIGURED_ERROR : { error: "Faça login para entrar no quadro colaborativo." };
  }
  const { supabase } = auth;
  if ((await getSocialAccessStatus()) !== "granted") return NOT_GRANTED_ERROR;

  const { error } = await supabase.rpc("join_collab_board_session", { p_session_id: sessionId });
  if (error) return { error: "Não foi possível entrar neste quadro (o link pode ser inválido, ou ele já tem dois participantes)." };
}

/** Pushes the local ink layer's current PNG snapshot so the other
 * participant's postgres_changes subscription picks it up — authorization
 * is entirely the collab_board_sessions_update RLS policy (must be a
 * participant), this only narrows the query. */
export async function saveCollabBoardSnapshot(sessionId: string, dataUrl: string): Promise<SaveSnapshotResult> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return { error: "not_authorized" };
  const { supabase, user } = auth;

  const { error } = await supabase
    .from("collab_board_sessions")
    .update({ canvas_data_url: dataUrl, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) return { error: "save_failed" };
}

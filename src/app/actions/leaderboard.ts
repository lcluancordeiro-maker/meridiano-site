"use server";

import { revalidatePath } from "next/cache";
import { getAuthedSupabase } from "@/lib/actionAuth";

/** Liga/desliga a participação do usuário na liga semanal (opt-in). Quem
 * não participa não aparece no ranking nem consegue vê-lo. */
export async function setLeaderboardOptIn(formData: FormData): Promise<void> {
  const auth = await getAuthedSupabase();
  if ("reason" in auth) return;
  const { supabase, user } = auth;

  const optIn = String(formData.get("optIn")) === "true";
  await supabase.from("profiles").update({ leaderboard_opt_in: optIn }).eq("id", user.id);
  revalidatePath("/liga");
}

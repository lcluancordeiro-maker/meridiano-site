"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Liga/desliga a participação do usuário na liga semanal (opt-in). Quem
 * não participa não aparece no ranking nem consegue vê-lo. */
export async function setLeaderboardOptIn(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  if (!supabase) return;

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const optIn = String(formData.get("optIn")) === "true";
  await supabase.from("profiles").update({ leaderboard_opt_in: optIn }).eq("id", user.id);
  revalidatePath("/liga");
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type DeleteAccountFormState = { error?: string } | undefined;

/**
 * Permanently deletes the logged-in user's account. Every table in
 * supabase/schema.sql that references a user does so with
 * `on delete cascade`, so deleting the auth.users row (via the admin API,
 * which only the service-role client can call) cascades through profile,
 * progress, subscription, chat/community messages, turmas, everything —
 * there's no need to delete from each table by hand.
 *
 * Requires the user to type their own email as a confirmation step (the
 * form enforces this client-side too, but the real check is the sameness
 * assertion here — the server never trusts client-side validation alone).
 */
export async function deleteMyAccount(
  _prevState: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  if (!isSupabaseConfigured) return { error: "Contas ainda não estão disponíveis neste app." };

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) return { error: "Faça login para excluir sua conta." };

  const confirmationEmail = String(formData.get("confirmationEmail") ?? "").trim();
  if (confirmationEmail.toLowerCase() !== (user.email ?? "").toLowerCase()) {
    return { error: "Digite seu e-mail exatamente como aparece na sua conta para confirmar." };
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) return { error: "Não foi possível excluir sua conta agora. Tente novamente mais tarde." };

  const { error } = await serviceRole.auth.admin.deleteUser(user.id);
  if (error) return { error: "Não foi possível excluir sua conta agora. Tente novamente mais tarde." };

  await supabase.auth.signOut();
  redirect("/conta/excluida");
}

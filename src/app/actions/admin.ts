"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdmin } from "@/lib/entitlements";

async function requireAdmin() {
  if (!isSupabaseConfigured) return null;
  if (!(await isAdmin())) return null;
  const supabase = await createClient();
  return supabase;
}

export async function dismissReport(reportId: string): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase.rpc("resolve_report", { p_report_id: reportId, p_status: "dismissed" });
  revalidatePath("/admin/moderacao");
}

export async function actionTakenReport(reportId: string): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase.rpc("resolve_report", { p_report_id: reportId, p_status: "action_taken" });
  revalidatePath("/admin/moderacao");
}

export async function banUserFromSocial(userId: string, reason: string): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase.rpc("ban_user", { p_user_id: userId, p_reason: reason || null });
  revalidatePath("/admin/moderacao");
}

export async function unbanUserFromSocial(userId: string): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase.rpc("unban_user", { p_user_id: userId });
  revalidatePath("/admin/moderacao");
}

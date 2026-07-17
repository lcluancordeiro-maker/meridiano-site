"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileTipo } from "@/lib/database.types";

export type ProfileState = { error: string | null; success?: boolean };

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const nome = String(formData.get("nome") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim() || null;
  const telefone = String(formData.get("telefone") ?? "").trim() || null;
  const cpf_cnpj = String(formData.get("cpf_cnpj") ?? "").trim() || null;
  const tipo = String(formData.get("tipo") ?? "comprador") as ProfileTipo;

  if (!nome) return { error: "Informe seu nome." };
  if (!["comprador", "vendedor", "ambos"].includes(tipo)) {
    return { error: "Tipo de conta inválido." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nome, empresa, telefone, cpf_cnpj, tipo })
    .eq("id", user.id);

  if (error) return { error: "Não foi possível salvar seu perfil." };

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

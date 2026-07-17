"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProposalStatus } from "@/lib/database.types";

export type ProposalState = { error: string | null; success?: boolean };

export async function createProposalAction(
  _prevState: ProposalState,
  formData: FormData
): Promise<ProposalState> {
  const listingId = String(formData.get("listing_id") ?? "");
  const valorProposto = Number(formData.get("valor_proposto"));
  const mensagem = String(formData.get("mensagem") ?? "").trim() || null;

  if (!listingId || !valorProposto || valorProposto <= 0) {
    return { error: "Informe um valor de proposta válido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/entrar?next=/catalogo/${listingId}`);
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("seller_id")
    .eq("id", listingId)
    .single();

  if (listing?.seller_id === user.id) {
    return { error: "Você não pode propor em um anúncio próprio." };
  }

  const { error } = await supabase.from("proposals").insert({
    listing_id: listingId,
    buyer_id: user.id,
    valor_proposto: valorProposto,
    mensagem,
  });

  if (error) {
    return { error: "Não foi possível enviar sua proposta. Tente novamente." };
  }

  revalidatePath(`/catalogo/${listingId}`);
  revalidatePath("/dashboard/propostas");
  return { error: null, success: true };
}

export async function updateProposalStatusAction(
  proposalId: string,
  status: ProposalStatus,
  resposta?: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ status, resposta_vendedor: resposta ?? null })
    .eq("id", proposalId);

  if (error) {
    throw new Error("Não foi possível atualizar a proposta.");
  }

  revalidatePath("/dashboard/propostas");
}

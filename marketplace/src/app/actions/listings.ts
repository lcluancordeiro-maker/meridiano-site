"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Esfera, ListingStatus, Natureza, TipoAtivo } from "@/lib/database.types";

export type ListingState = { error: string | null };

function parseListingForm(formData: FormData) {
  const valorDeFace = Number(formData.get("valor_de_face"));
  const valorPedido = Number(formData.get("valor_pedido"));

  return {
    tipo_ativo: String(formData.get("tipo_ativo") ?? "precatorio") as TipoAtivo,
    ente_devedor: String(formData.get("ente_devedor") ?? "").trim(),
    esfera: String(formData.get("esfera") ?? "") as Esfera,
    tribunal: String(formData.get("tribunal") ?? "").trim(),
    numero_processo: String(formData.get("numero_processo") ?? "").trim() || null,
    natureza: String(formData.get("natureza") ?? "comum") as Natureza,
    valor_de_face: valorDeFace,
    valor_pedido: valorPedido,
    data_expedicao: String(formData.get("data_expedicao") ?? "") || null,
    previsao_pagamento: String(formData.get("previsao_pagamento") ?? "").trim() || null,
    estado: String(formData.get("estado") ?? ""),
    comarca: String(formData.get("comarca") ?? "").trim() || null,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
  };
}

function validateListing(data: ReturnType<typeof parseListingForm>): string | null {
  if (!data.ente_devedor) return "Informe o ente devedor.";
  if (!data.esfera) return "Selecione a esfera.";
  if (!data.tribunal) return "Informe o tribunal.";
  if (!data.estado) return "Selecione o estado.";
  if (!data.valor_de_face || data.valor_de_face <= 0) return "Informe o valor de face.";
  if (!data.valor_pedido || data.valor_pedido <= 0) return "Informe o valor pedido.";
  if (data.valor_pedido > data.valor_de_face) {
    return "O valor pedido não pode ser maior que o valor de face.";
  }
  return null;
}

export async function createListingAction(
  _prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/dashboard/anuncios/novo");

  const data = parseListingForm(formData);
  const validationError = validateListing(data);
  if (validationError) return { error: validationError };

  const { data: inserted, error } = await supabase
    .from("listings")
    .insert({ ...data, seller_id: user.id })
    .select("id")
    .single();

  if (error) {
    return { error: "Não foi possível criar o anúncio. Tente novamente." };
  }

  revalidatePath("/dashboard/anuncios");
  revalidatePath("/catalogo");
  redirect(`/dashboard/anuncios/${inserted.id}/editar?criado=1`);
}

export async function updateListingAction(
  listingId: string,
  _prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const data = parseListingForm(formData);
  const validationError = validateListing(data);
  if (validationError) return { error: validationError };

  const { error } = await supabase
    .from("listings")
    .update(data)
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/dashboard/anuncios");
  revalidatePath(`/catalogo/${listingId}`);
  revalidatePath("/catalogo");
  return { error: null };
}

export async function setListingStatusAction(listingId: string, status: ListingStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  revalidatePath("/dashboard/anuncios");
  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${listingId}`);
}

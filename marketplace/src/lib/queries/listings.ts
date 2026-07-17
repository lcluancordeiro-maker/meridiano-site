import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/database.types";

export interface CatalogFilters {
  tipoAtivo?: string;
  esfera?: string;
  natureza?: string;
  estado?: string;
  valorMin?: number;
  valorMax?: number;
  sort?: "recentes" | "menor_valor" | "maior_valor";
}

export async function fetchCatalog(filters: CatalogFilters): Promise<Listing[]> {
  const supabase = await createClient();
  let query = supabase.from("listings").select("*").eq("status", "disponivel");

  if (filters.tipoAtivo) query = query.eq("tipo_ativo", filters.tipoAtivo);
  if (filters.esfera) query = query.eq("esfera", filters.esfera);
  if (filters.natureza) query = query.eq("natureza", filters.natureza);
  if (filters.estado) query = query.eq("estado", filters.estado);
  if (filters.valorMin !== undefined) query = query.gte("valor_pedido", filters.valorMin);
  if (filters.valorMax !== undefined) query = query.lte("valor_pedido", filters.valorMax);

  if (filters.sort === "menor_valor") {
    query = query.order("valor_pedido", { ascending: true });
  } else if (filters.sort === "maior_valor") {
    query = query.order("valor_pedido", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("fetchCatalog error", error);
    return [];
  }
  return data ?? [];
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function fetchSellerProfile(sellerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, nome, empresa")
    .eq("id", sellerId)
    .single();
  return data;
}

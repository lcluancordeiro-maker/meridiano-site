import { createClient } from "@/lib/supabase/server";
import type { Listing, Profile, Proposal } from "@/lib/database.types";

export async function fetchCurrentProfile(): Promise<{
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user: { id: user.id, email: user.email ?? null }, profile };
}

export async function fetchMyListings(sellerId: string): Promise<Listing[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchListingOwnedBy(id: string, sellerId: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("seller_id", sellerId)
    .single();
  return data;
}

export interface ProposalWithListing extends Proposal {
  listing: Pick<Listing, "id" | "ente_devedor" | "tribunal" | "valor_de_face"> | null;
}

export async function fetchProposalsReceived(sellerId: string): Promise<ProposalWithListing[]> {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id")
    .eq("seller_id", sellerId);

  const listingIds = (listings ?? []).map((l) => l.id);
  if (listingIds.length === 0) return [];

  const { data } = await supabase
    .from("proposals")
    .select("*, listing:listings(id, ente_devedor, tribunal, valor_de_face)")
    .in("listing_id", listingIds)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as ProposalWithListing[];
}

export async function fetchProposalsSent(buyerId: string): Promise<ProposalWithListing[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proposals")
    .select("*, listing:listings(id, ente_devedor, tribunal, valor_de_face)")
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as ProposalWithListing[];
}

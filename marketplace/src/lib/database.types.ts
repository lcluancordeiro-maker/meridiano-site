export type ProfileTipo = "comprador" | "vendedor" | "ambos";

export type TipoAtivo = "precatorio" | "ativo_judicial";
export type Esfera = "federal" | "estadual" | "municipal";
export type Natureza = "alimentar" | "comum";
export type ListingStatus = "disponivel" | "em_negociacao" | "vendido" | "removido";
export type ProposalStatus = "pendente" | "aceita" | "recusada" | "contraproposta";

export interface Profile {
  id: string;
  tipo: ProfileTipo;
  nome: string;
  empresa: string | null;
  telefone: string | null;
  cpf_cnpj: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  tipo_ativo: TipoAtivo;
  ente_devedor: string;
  esfera: Esfera;
  tribunal: string;
  numero_processo: string | null;
  natureza: Natureza;
  valor_de_face: number;
  valor_pedido: number;
  data_expedicao: string | null;
  previsao_pagamento: string | null;
  estado: string;
  comarca: string | null;
  descricao: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  listing_id: string;
  buyer_id: string;
  valor_proposto: number;
  mensagem: string | null;
  status: ProposalStatus;
  resposta_vendedor: string | null;
  created_at: string;
  updated_at: string;
}

// These are hand-written row types, not generated via `supabase gen types
// typescript`. Once a real Supabase project exists, generate the full
// `Database` type from it and parametrize the clients in lib/supabase/*.ts
// for query-level type safety (see the comment in lib/supabase/client.ts).

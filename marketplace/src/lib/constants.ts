export const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
] as const;

export const ESFERAS = [
  { value: "federal", label: "Federal" },
  { value: "estadual", label: "Estadual" },
  { value: "municipal", label: "Municipal" },
] as const;

export const NATUREZAS = [
  { value: "alimentar", label: "Alimentar" },
  { value: "comum", label: "Comum" },
] as const;

export const TIPOS_ATIVO = [
  { value: "precatorio", label: "Precatório" },
  { value: "ativo_judicial", label: "Outro ativo judicial" },
] as const;

export const LISTING_STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  em_negociacao: "Em negociação",
  vendido: "Vendido",
  removido: "Removido",
};

export const PROPOSAL_STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aceita: "Aceita",
  recusada: "Recusada",
  contraproposta: "Contraproposta",
};

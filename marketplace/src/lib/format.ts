export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDeságio(valorDeFace: number, valorPedido: number): number {
  if (valorDeFace <= 0) return 0;
  return Math.round((1 - valorPedido / valorDeFace) * 1000) / 10;
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

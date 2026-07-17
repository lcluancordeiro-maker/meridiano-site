import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchListingById, fetchSellerProfile } from "@/lib/queries/listings";
import { formatBRL, formatDate, formatDeságio } from "@/lib/format";
import { ProposalForm } from "@/components/proposal-form";

const NATUREZA_LABEL: Record<string, string> = { alimentar: "Alimentar", comum: "Comum" };
const ESFERA_LABEL: Record<string, string> = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
};
const TIPO_LABEL: Record<string, string> = {
  precatorio: "Precatório",
  ativo_judicial: "Outro ativo judicial",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);
  return { title: listing ? listing.ente_devedor : "Ativo não encontrado" };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListingById(id);

  if (!listing || listing.status !== "disponivel") {
    notFound();
  }

  const seller = await fetchSellerProfile(listing.seller_id);
  const deságio = formatDeságio(listing.valor_de_face, listing.valor_pedido);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy-deep/5 px-2.5 py-1 text-xs font-semibold text-navy-deep">
          {TIPO_LABEL[listing.tipo_ativo]}
        </span>
        <span className="rounded-full bg-navy-deep/5 px-2.5 py-1 text-xs font-semibold text-navy-deep">
          {ESFERA_LABEL[listing.esfera]}
        </span>
        <span className="rounded-full bg-navy-deep/5 px-2.5 py-1 text-xs font-semibold text-navy-deep">
          {NATUREZA_LABEL[listing.natureza]}
        </span>
      </div>

      <h1 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">
        {listing.ente_devedor}
      </h1>
      <p className="mt-1 text-muted">
        {listing.tribunal} · {listing.comarca ? `${listing.comarca}, ` : ""}
        {listing.estado}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="grid grid-cols-2 gap-6 rounded-lg border border-border bg-white p-6 sm:grid-cols-3">
            <Stat label="Valor de face" value={formatBRL(listing.valor_de_face)} />
            <Stat label="Valor pedido" value={formatBRL(listing.valor_pedido)} />
            <Stat label="Deságio" value={`${deságio}%`} highlight />
            <Stat label="Nº do processo" value={listing.numero_processo || "—"} />
            <Stat label="Data de expedição" value={formatDate(listing.data_expedicao)} />
            <Stat label="Previsão de pagamento" value={listing.previsao_pagamento || "—"} />
          </div>

          {listing.descricao && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-navy-deep">Descrição</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                {listing.descricao}
              </p>
            </div>
          )}

          {seller && (
            <div className="mt-8 rounded-lg border border-border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Anunciado por
              </p>
              <p className="mt-1 font-medium text-navy-deep">
                {seller.empresa || seller.nome}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-lg border border-border bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-navy-deep">
              Tenho interesse
            </h2>
            <p className="mt-1 text-sm text-muted">
              Envie uma proposta de valor. O vendedor pode aceitar, recusar ou
              enviar uma contraproposta.
            </p>
            <div className="mt-5">
              <ProposalForm listingId={listing.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-semibold ${highlight ? "text-gold" : "text-navy-deep"}`}>
        {value}
      </p>
    </div>
  );
}

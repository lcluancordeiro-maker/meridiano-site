import type { Metadata } from "next";
import { fetchCatalog, type CatalogFilters as Filters } from "@/lib/queries/listings";
import { CatalogFilters } from "@/components/catalog-filters";
import { ListingCard } from "@/components/listing-card";

export const metadata: Metadata = { title: "Catálogo de precatórios e ativos judiciais" };

type SearchParams = Record<string, string | undefined>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: Filters = {
    tipoAtivo: params.tipoAtivo || undefined,
    esfera: params.esfera || undefined,
    natureza: params.natureza || undefined,
    estado: params.estado || undefined,
    valorMin: params.valorMin ? Number(params.valorMin) : undefined,
    valorMax: params.valorMax ? Number(params.valorMax) : undefined,
    sort: (params.sort as Filters["sort"]) || "recentes",
  };

  const listings = await fetchCatalog(filters);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">
          Catálogo de ativos
        </h1>
        <p className="mt-2 text-muted">
          {listings.length}{" "}
          {listings.length === 1 ? "ativo disponível" : "ativos disponíveis"} para negociação.
        </p>
      </div>

      <div className="mb-10">
        <CatalogFilters current={params} />
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center text-muted">
          Nenhum ativo encontrado com esses filtros. Tente ampliar a busca.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

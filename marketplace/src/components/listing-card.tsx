import Link from "next/link";
import type { Listing } from "@/lib/database.types";
import { formatBRL, formatDeságio } from "@/lib/format";

const NATUREZA_LABEL: Record<string, string> = {
  alimentar: "Alimentar",
  comum: "Comum",
};

const ESFERA_LABEL: Record<string, string> = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const deságio = formatDeságio(listing.valor_de_face, listing.valor_pedido);

  return (
    <Link
      href={`/catalogo/${listing.id}`}
      className="block rounded-lg border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-navy-deep/5 px-2.5 py-1 text-xs font-semibold text-navy-deep">
          {ESFERA_LABEL[listing.esfera] ?? listing.esfera}
        </span>
        <span className="rounded-full bg-navy-deep/5 px-2.5 py-1 text-xs font-semibold text-navy-deep">
          {NATUREZA_LABEL[listing.natureza] ?? listing.natureza}
        </span>
        <span className="ml-auto text-xs font-medium text-muted">{listing.estado}</span>
      </div>

      <h3 className="font-serif text-lg font-semibold text-navy-deep">
        {listing.ente_devedor}
      </h3>
      <p className="mt-1 text-sm text-muted">{listing.tribunal}</p>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
        <div>
          <p className="text-xs text-muted">Valor de face</p>
          <p className="font-semibold text-navy-deep">{formatBRL(listing.valor_de_face)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Valor pedido</p>
          <p className="font-semibold text-navy-deep">{formatBRL(listing.valor_pedido)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Deságio</p>
          <p className="font-semibold text-gold">{deságio}%</p>
        </div>
      </div>
    </Link>
  );
}

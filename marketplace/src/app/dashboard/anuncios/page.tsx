import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchCurrentProfile, fetchMyListings } from "@/lib/queries/dashboard";
import { formatBRL, formatDeságio } from "@/lib/format";
import { LISTING_STATUS_LABEL } from "@/lib/constants";
import { ListingStatusMenu } from "@/components/listing-status-menu";

export const metadata: Metadata = { title: "Meus anúncios" };

const STATUS_STYLE: Record<string, string> = {
  disponivel: "bg-green/10 text-green",
  em_negociacao: "bg-gold/15 text-gold",
  vendido: "bg-navy-deep/10 text-navy-deep",
  removido: "bg-red/10 text-red",
};

export default async function MeusAnunciosPage() {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard/anuncios");
  if (profile && profile.tipo === "comprador") redirect("/dashboard");

  const listings = await fetchMyListings(user.id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy-deep">Meus anúncios</h1>
          <p className="mt-1 text-sm text-muted">Gerencie os ativos que você publicou.</p>
        </div>
        <Link
          href="/dashboard/anuncios/novo"
          className="rounded-md bg-navy-deep px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy"
        >
          + Novo anúncio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center text-muted">
          Você ainda não publicou nenhum anúncio.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-navy-deep/5 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Ente devedor</th>
                <th className="px-5 py-3">Valor pedido</th>
                <th className="px-5 py-3">Deságio</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/anuncios/${l.id}/editar`}
                      className="font-medium text-navy-deep hover:underline"
                    >
                      {l.ente_devedor}
                    </Link>
                    <p className="text-xs text-muted">{l.tribunal}</p>
                  </td>
                  <td className="px-5 py-4">{formatBRL(l.valor_pedido)}</td>
                  <td className="px-5 py-4">
                    {formatDeságio(l.valor_de_face, l.valor_pedido)}%
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[l.status]}`}
                    >
                      {LISTING_STATUS_LABEL[l.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ListingStatusMenu listingId={l.id} status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

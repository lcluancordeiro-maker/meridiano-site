import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  fetchCurrentProfile,
  fetchProposalsReceived,
  fetchProposalsSent,
  type ProposalWithListing,
} from "@/lib/queries/dashboard";
import { formatBRL, formatDate } from "@/lib/format";
import { PROPOSAL_STATUS_LABEL } from "@/lib/constants";
import { ProposalResponse } from "@/components/proposal-response";

export const metadata: Metadata = { title: "Propostas" };

const STATUS_STYLE: Record<string, string> = {
  pendente: "bg-gold/15 text-gold",
  aceita: "bg-green/10 text-green",
  recusada: "bg-red/10 text-red",
  contraproposta: "bg-navy-deep/10 text-navy-deep",
};

export default async function PropostasPage() {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard/propostas");

  const podeVender = profile?.tipo === "vendedor" || profile?.tipo === "ambos";
  const podeComprar = profile?.tipo === "comprador" || profile?.tipo === "ambos";

  const [recebidas, enviadas] = await Promise.all([
    podeVender ? fetchProposalsReceived(user.id) : Promise.resolve([]),
    podeComprar ? fetchProposalsSent(user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-12">
      {podeVender && (
        <section>
          <h1 className="font-serif text-2xl font-semibold text-navy-deep">
            Propostas recebidas
          </h1>
          <p className="mt-1 text-sm text-muted">
            Propostas de compradores para os seus anúncios.
          </p>
          <div className="mt-6">
            <ProposalList proposals={recebidas} mode="recebida" />
          </div>
        </section>
      )}

      {podeComprar && (
        <section>
          <h2 className="font-serif text-2xl font-semibold text-navy-deep">Minhas propostas</h2>
          <p className="mt-1 text-sm text-muted">Propostas que você enviou para vendedores.</p>
          <div className="mt-6">
            <ProposalList proposals={enviadas} mode="enviada" />
          </div>
        </section>
      )}
    </div>
  );
}

function ProposalList({
  proposals,
  mode,
}: {
  proposals: ProposalWithListing[];
  mode: "recebida" | "enviada";
}) {
  if (proposals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-muted">
        Nenhuma proposta {mode === "recebida" ? "recebida" : "enviada"} ainda.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((p) => (
        <div key={p.id} className="rounded-lg border border-border bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                href={p.listing ? `/catalogo/${p.listing.id}` : "#"}
                className="font-semibold text-navy-deep hover:underline"
              >
                {p.listing?.ente_devedor ?? "Anúncio removido"}
              </Link>
              <p className="text-xs text-muted">{p.listing?.tribunal}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[p.status]}`}
            >
              {PROPOSAL_STATUS_LABEL[p.status]}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted">Valor proposto</p>
              <p className="font-semibold text-navy-deep">{formatBRL(p.valor_proposto)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Enviada em</p>
              <p className="font-medium text-navy-deep">{formatDate(p.created_at)}</p>
            </div>
          </div>

          {p.mensagem && (
            <p className="mt-3 rounded-md bg-navy-deep/5 px-3 py-2 text-sm text-navy-deep">
              “{p.mensagem}”
            </p>
          )}

          {p.resposta_vendedor && (
            <p className="mt-3 rounded-md bg-gold/10 px-3 py-2 text-sm text-navy-deep">
              <span className="font-semibold">Resposta do vendedor: </span>
              {p.resposta_vendedor}
            </p>
          )}

          {mode === "recebida" && p.status === "pendente" && (
            <ProposalResponse proposalId={p.id} />
          )}
        </div>
      ))}
    </div>
  );
}

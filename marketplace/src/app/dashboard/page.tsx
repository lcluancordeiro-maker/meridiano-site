import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  fetchCurrentProfile,
  fetchMyListings,
  fetchProposalsReceived,
  fetchProposalsSent,
} from "@/lib/queries/dashboard";

export const metadata: Metadata = { title: "Visão geral" };

export default async function DashboardPage() {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard");

  const podeVender = profile?.tipo === "vendedor" || profile?.tipo === "ambos";
  const podeComprar = profile?.tipo === "comprador" || profile?.tipo === "ambos";

  const [listings, propostasRecebidas, propostasEnviadas] = await Promise.all([
    podeVender ? fetchMyListings(user.id) : Promise.resolve([]),
    podeVender ? fetchProposalsReceived(user.id) : Promise.resolve([]),
    podeComprar ? fetchProposalsSent(user.id) : Promise.resolve([]),
  ]);

  const anunciosAtivos = listings.filter((l) => l.status === "disponivel").length;
  const pendentesRecebidas = propostasRecebidas.filter((p) => p.status === "pendente").length;
  const pendentesEnviadas = propostasEnviadas.filter((p) => p.status === "pendente").length;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-deep">
        Olá, {profile?.nome?.split(" ")[0] || "bem-vindo(a)"}
      </h1>
      <p className="mt-1 text-sm text-muted">Resumo da sua conta na Precatta.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {podeVender && (
          <>
            <StatCard label="Anúncios ativos" value={anunciosAtivos} href="/dashboard/anuncios" />
            <StatCard
              label="Propostas recebidas pendentes"
              value={pendentesRecebidas}
              href="/dashboard/propostas"
            />
          </>
        )}
        {podeComprar && (
          <StatCard
            label="Propostas enviadas pendentes"
            value={pendentesEnviadas}
            href="/dashboard/propostas"
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {podeVender && (
          <Link
            href="/dashboard/anuncios/novo"
            className="rounded-md bg-navy-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy"
          >
            + Novo anúncio
          </Link>
        )}
        {podeComprar && (
          <Link
            href="/catalogo"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy-deep hover:border-navy-light"
          >
            Explorar catálogo
          </Link>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border bg-white p-6 transition hover:border-navy-light"
    >
      <p className="text-3xl font-semibold text-navy-deep">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Link>
  );
}

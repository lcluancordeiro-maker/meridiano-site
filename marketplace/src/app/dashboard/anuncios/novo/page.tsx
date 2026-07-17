import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchCurrentProfile } from "@/lib/queries/dashboard";
import { createListingAction } from "@/app/actions/listings";
import { ListingForm } from "@/components/listing-form";

export const metadata: Metadata = { title: "Novo anúncio" };

export default async function NovoAnuncioPage() {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard/anuncios/novo");
  if (profile && profile.tipo === "comprador") redirect("/dashboard");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-deep">Novo anúncio</h1>
      <p className="mt-1 text-sm text-muted">
        Preencha os dados do precatório ou ativo judicial que você quer anunciar.
      </p>
      <div className="mt-8 max-w-2xl rounded-lg border border-border bg-white p-6">
        <ListingForm action={createListingAction} submitLabel="Publicar anúncio" />
      </div>
    </div>
  );
}

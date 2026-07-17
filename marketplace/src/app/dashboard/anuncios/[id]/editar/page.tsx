import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { fetchCurrentProfile, fetchListingOwnedBy } from "@/lib/queries/dashboard";
import { updateListingAction } from "@/app/actions/listings";
import { ListingForm } from "@/components/listing-form";

export const metadata: Metadata = { title: "Editar anúncio" };

export default async function EditarAnuncioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  const { id } = await params;
  const { criado } = await searchParams;
  const { user } = await fetchCurrentProfile();
  if (!user) redirect(`/entrar?next=/dashboard/anuncios/${id}/editar`);

  const listing = await fetchListingOwnedBy(id, user.id);
  if (!listing) notFound();

  const boundAction = updateListingAction.bind(null, id);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-deep">Editar anúncio</h1>
      <p className="mt-1 text-sm text-muted">{listing.ente_devedor}</p>

      {criado && (
        <p className="mt-4 rounded-md bg-green/10 px-3 py-2 text-sm text-green">
          Anúncio publicado com sucesso! Você pode revisar os dados abaixo.
        </p>
      )}

      <div className="mt-8 max-w-2xl rounded-lg border border-border bg-white p-6">
        <ListingForm action={boundAction} defaultValues={listing} submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}

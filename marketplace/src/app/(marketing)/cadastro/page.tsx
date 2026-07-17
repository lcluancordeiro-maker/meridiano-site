import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import type { ProfileTipo } from "@/lib/database.types";

export const metadata: Metadata = { title: "Criar conta" };

const VALID_TIPOS: ProfileTipo[] = ["comprador", "vendedor", "ambos"];

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const defaultTipo = VALID_TIPOS.includes(tipo as ProfileTipo)
    ? (tipo as ProfileTipo)
    : "comprador";

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-serif text-3xl font-semibold text-navy-deep">Criar conta</h1>
      <p className="mt-2 text-sm text-muted">
        Leva menos de dois minutos. Você pode comprar, vender, ou os dois.
      </p>
      <div className="mt-8">
        <SignupForm defaultTipo={defaultTipo} />
      </div>
    </div>
  );
}

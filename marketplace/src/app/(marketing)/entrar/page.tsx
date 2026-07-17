import type { Metadata } from "next";
import { SigninForm } from "@/components/auth/signin-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-serif text-3xl font-semibold text-navy-deep">Entrar</h1>
      <p className="mt-2 text-sm text-muted">Acesse sua conta Precatta.</p>
      <div className="mt-8">
        <SigninForm next={next ?? "/dashboard"} />
      </div>
    </div>
  );
}

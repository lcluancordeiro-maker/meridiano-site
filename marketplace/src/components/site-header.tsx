import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-deep/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy-deep text-sm font-bold">
            P
          </span>
          Precatta
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          <Link href="/catalogo" className="hover:text-white">
            Catálogo
          </Link>
          <Link href="/#como-funciona" className="hover:text-white">
            Como funciona
          </Link>
          <Link href="/#vender" className="hover:text-white">
            Vender ativos
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-navy-deep transition hover:bg-gold-light"
            >
              Minha área
            </Link>
          ) : (
            <>
              <Link
                href="/entrar"
                className="hidden text-sm font-medium text-white/85 hover:text-white sm:block"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy-deep transition hover:bg-gold-light"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchCurrentProfile } from "@/lib/queries/dashboard";
import { signOutAction } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard");

  const podeVender = profile?.tipo === "vendedor" || profile?.tipo === "ambos";
  const podeComprar = profile?.tipo === "comprador" || profile?.tipo === "ambos";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <Link href="/" className="flex items-center gap-2 px-6 py-6 font-serif text-lg font-semibold text-navy-deep">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy-deep text-sm font-bold">
            P
          </span>
          Precatta
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3 text-sm font-medium">
          <SidebarLink href="/dashboard">Visão geral</SidebarLink>
          {podeVender && <SidebarLink href="/dashboard/anuncios">Meus anúncios</SidebarLink>}
          <SidebarLink href="/dashboard/propostas">
            {podeVender && podeComprar
              ? "Propostas"
              : podeVender
                ? "Propostas recebidas"
                : "Minhas propostas"}
          </SidebarLink>
          <SidebarLink href="/dashboard/perfil">Perfil</SidebarLink>
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate px-2 text-xs text-muted">{user.email}</p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-2 w-full rounded-md px-2 py-2 text-left text-sm font-medium text-red hover:bg-red/5"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 bg-background">
        <header className="border-b border-border bg-white px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-semibold text-navy-deep">
              Precatta
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="text-sm font-medium text-red">
                Sair
              </button>
            </form>
          </div>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-navy-deep/80">
            <Link href="/dashboard">Visão geral</Link>
            {podeVender && <Link href="/dashboard/anuncios">Meus anúncios</Link>}
            <Link href="/dashboard/propostas">Propostas</Link>
            <Link href="/dashboard/perfil">Perfil</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2.5 text-navy-deep/80 transition hover:bg-navy-deep/5 hover:text-navy-deep"
    >
      {children}
    </Link>
  );
}

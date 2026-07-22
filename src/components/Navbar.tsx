import Link from "next/link";
import NavbarXpBadge from "./NavbarXpBadge";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNavMenu from "./MobileNavMenu";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { getServerLocale } from "@/i18n/getServerLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { isAdmin, isPremiumUser } from "@/lib/entitlements";

export default async function Navbar() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const isPremium = user ? await isPremiumUser() : false;
  const isModerator = user ? await isAdmin() : false;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  // Primary: the core learning loop, always visible. Everything else is
  // real and useful but secondary to "study a topic, track progress" — it
  // lives behind the "Mais" menu so the top-level nav stays scannable
  // (Brilliant.org keeps its own shell down to essentially one action).
  const primaryNavItems = [
    { href: "/#niveis", label: dict.nav.trilhas },
    { href: "/progresso", label: dict.nav.progresso },
    { href: "/revisao", label: dict.nav.revisao },
  ];

  const secondaryNavItems = [
    { href: "/calculadora", label: dict.nav.calculadora },
    { href: "/foto", label: dict.nav.resolverFoto },
    { href: "/quadro", label: dict.nav.quadro },
    { href: "/historico", label: dict.nav.historico },
    { href: "/turmas", label: dict.nav.turmas },
    { href: "/chat", label: dict.chat.title },
    { href: "/comunidades", label: dict.communities.title },
    { href: "/lives", label: dict.lives.title },
    { href: "/liga", label: dict.nav.liga },
    { href: "/matematicos", label: dict.nav.matematicos },
    ...(isModerator ? [{ href: "/admin/moderacao", label: "Moderação" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold text-foreground sm:text-lg">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </span>
          <span className="whitespace-nowrap">
            Meridiano <span className="text-primary">Matemática</span>
          </span>
        </Link>
        <MobileNavMenu
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryNavItems}
          moreLabel={dict.nav.mais}
          openLabel={dict.nav.abrirMenu}
          closeLabel={dict.nav.fecharMenu}
        >
          <Link
            href="/assinatura"
            className={
              isPremium
                ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                : "hover:text-foreground transition-colors"
            }
          >
            {dict.premium.navBadge}
          </Link>
          <NavbarXpBadge />
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <form action={logout} className="flex items-center gap-3">
              <Link
                href="/conta"
                className="hidden text-xs text-muted hover:text-foreground sm:inline"
                title={user.email ?? undefined}
              >
                {user.email}
              </Link>
              <button
                type="submit"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
              >
                {dict.nav.sair}
              </button>
            </form>
          ) : (
            <Link
              href="/entrar"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary"
            >
              {dict.nav.entrar}
            </Link>
          )}
        </MobileNavMenu>
      </div>
    </header>
  );
}

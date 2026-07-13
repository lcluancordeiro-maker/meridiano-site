import Link from "next/link";
import NavbarXpBadge from "./NavbarXpBadge";

export default function Navbar() {
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
        <nav className="flex items-center gap-4 text-sm font-medium text-muted sm:gap-6">
          <Link href="/#niveis" className="hover:text-foreground transition-colors">
            Trilhas
          </Link>
          <Link href="/calculadora" className="hover:text-foreground transition-colors">
            Calculadora
          </Link>
          <Link href="/progresso" className="hover:text-foreground transition-colors">
            Progresso
          </Link>
          <NavbarXpBadge />
        </nav>
      </div>
    </header>
  );
}

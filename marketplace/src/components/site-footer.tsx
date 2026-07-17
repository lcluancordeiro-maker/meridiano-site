import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-navy-deep text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy-deep text-sm font-bold">
                P
              </span>
              Precatta
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Marketplace que conecta detentores de precatórios e ativos judiciais
              a investidores qualificados.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-semibold text-white">Plataforma</p>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="hover:text-white">
                  Catálogo de ativos
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-white">
                  Anunciar um precatório
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-white">
                  Como funciona
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-semibold text-white">Aviso</p>
            <p className="leading-relaxed">
              A Precatta atua como plataforma de conexão entre as partes e não é
              parte na negociação, não presta consultoria jurídica ou
              financeira e não garante a liquidação dos créditos anunciados.
              Cabe às partes realizar a devida diligência antes de fechar
              qualquer operação.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Precatta. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

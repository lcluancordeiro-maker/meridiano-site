import Link from "next/link";

const BENEFICIOS_VENDEDOR = [
  {
    title: "Alcance investidores qualificados",
    body: "Seu precatório ou ativo judicial fica visível para uma base de compradores que já buscam este tipo de operação.",
  },
  {
    title: "Você define o preço",
    body: "Publique o valor de face e o valor pedido. As propostas chegam até você — sem intermediário fixando o deságio.",
  },
  {
    title: "Controle total do anúncio",
    body: "Edite, pause ou remova seu anúncio a qualquer momento pelo painel.",
  },
];

const BENEFICIOS_COMPRADOR = [
  {
    title: "Catálogo filtrável",
    body: "Filtre por tribunal, esfera, natureza do crédito, faixa de valor e deságio para achar a oportunidade certa.",
  },
  {
    title: "Dados objetivos de cada ativo",
    body: "Ente devedor, número do processo, data de expedição e previsão de pagamento em um só lugar.",
  },
  {
    title: "Envie propostas diretamente",
    body: "Negocie com o vendedor pelo próprio painel, sem burocracia para começar a conversa.",
  },
];

const PASSOS = [
  {
    n: "01",
    title: "Crie sua conta",
    body: "Cadastre-se como vendedor, comprador ou os dois — leva menos de dois minutos.",
  },
  {
    n: "02",
    title: "Anuncie ou explore",
    body: "Vendedores publicam os dados do ativo. Compradores navegam o catálogo com filtros.",
  },
  {
    n: "03",
    title: "Envie ou receba propostas",
    body: "O comprador propõe um valor; o vendedor aceita, recusa ou faz contraproposta.",
  },
  {
    n: "04",
    title: "Feche a operação",
    body: "Combinadas as condições, as partes seguem com a formalização da cessão de crédito.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-deep py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gold-light">
              Marketplace de precatórios e ativos judiciais
            </span>
            <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Conectamos quem tem <em className="text-gold-light not-italic">precatórios</em> a
              quem quer <em className="text-gold-light not-italic">investir</em> neles
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Publique seu ativo judicial em minutos ou explore um catálogo de
              precatórios à venda, com filtros por tribunal, natureza do
              crédito e deságio. Sem intermediário fixando o preço.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cadastro?tipo=vendedor"
                className="rounded-md bg-gold px-7 py-3 font-semibold text-navy-deep transition hover:bg-gold-light"
              >
                Quero vender um ativo
              </Link>
              <Link
                href="/catalogo"
                className="rounded-md border border-white/30 px-7 py-3 font-semibold text-white transition hover:border-white"
              >
                Quero comprar
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">
              Exemplo de anúncio
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/60">Ente devedor</span>
                <span className="font-medium">Estado de São Paulo</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/60">Natureza</span>
                <span className="font-medium">Alimentar</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/60">Valor de face</span>
                <span className="font-medium">R$ 480.000</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/60">Valor pedido</span>
                <span className="font-medium">R$ 336.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Deságio</span>
                <span className="font-semibold text-gold-light">30%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-xl">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
              Como funciona
            </span>
            <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">
              Do anúncio ao fechamento, em quatro passos
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((p) => (
              <div key={p.n} className="rounded-lg border border-border bg-white p-6">
                <span className="font-serif text-2xl font-semibold text-gold">{p.n}</span>
                <h3 className="mt-3 font-semibold text-navy-deep">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA VENDEDORES */}
      <section id="vender" className="bg-navy py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-gold-light">
                Para quem vende
              </span>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Transforme seu precatório em liquidez
              </h2>
              <p className="mt-4 text-white/75">
                Empresas, escritórios e pessoas físicas com precatórios ou
                outros ativos judiciais a receber podem anunciar gratuitamente
                e negociar diretamente com investidores interessados.
              </p>
              <Link
                href="/cadastro?tipo=vendedor"
                className="mt-6 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-navy-deep hover:bg-gold-light"
              >
                Anunciar meu ativo
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {BENEFICIOS_VENDEDOR.map((b) => (
                <div key={b.title} className="rounded-lg bg-white/5 p-5">
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARA COMPRADORES */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
                Para quem compra
              </span>
              <h2 className="font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">
                Encontre oportunidades com deságio
              </h2>
              <p className="mt-4 text-muted">
                Investidores, fundos e FIDCs podem filtrar o catálogo por
                tribunal, esfera, natureza do crédito e faixa de valor para
                encontrar ativos compatíveis com sua estratégia.
              </p>
              <Link
                href="/catalogo"
                className="mt-6 inline-block rounded-md bg-navy-deep px-6 py-3 font-semibold text-white hover:bg-navy"
              >
                Explorar catálogo
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {BENEFICIOS_COMPRADOR.map((b) => (
                <div key={b.title} className="rounded-lg border border-border bg-white p-5">
                  <h3 className="font-semibold text-navy-deep">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-navy-deep py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-white/75">
            Crie sua conta gratuita e publique seu primeiro anúncio ou envie
            sua primeira proposta hoje.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/cadastro"
              className="rounded-md bg-gold px-7 py-3 font-semibold text-navy-deep hover:bg-gold-light"
            >
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

# Precatta — Marketplace de Precatórios e Ativos Judiciais

Plataforma que conecta quem detém precatórios/ativos judiciais (vendedores)
a investidores que querem comprá-los (compradores). Next.js 16 (App Router) +
Supabase (Postgres + Auth).

"Precatta" é um nome provisório — troque livremente (busca e substituição no
código, mais a paleta de cores em `src/app/globals.css`).

## O que já está implementado

- **Landing page** explicando o marketplace, com CTAs para vender/comprar.
- **Cadastro/login** (Supabase Auth) com papel de conta: comprador, vendedor
  ou ambos.
- **Catálogo público** de ativos com filtros (tipo, esfera, natureza, estado,
  faixa de valor) — `/catalogo`.
- **Página de detalhe do ativo** com formulário de proposta — `/catalogo/[id]`.
- **Painel do vendedor**: criar, editar e mudar status de anúncios —
  `/dashboard/anuncios`.
- **Painel de propostas**: vendedor aceita/recusa/contrapropõe; comprador
  acompanha status — `/dashboard/propostas`.
- **Perfil de usuário** — `/dashboard/perfil`.

Todo o controle de acesso a dados (quem pode ver/editar o quê) é feito via
Row Level Security no Postgres, não na aplicação — veja
`supabase/migrations/0001_init.sql`.

## Pré-requisitos

- Node.js 20.9+
- Uma conta em [supabase.com](https://supabase.com) (plano free serve)

## Configurando o Supabase

1. Crie um novo projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. No painel do projeto, abra **SQL Editor** e rode o conteúdo de
   `supabase/migrations/0001_init.sql`. Isso cria as tabelas `profiles`,
   `listings`, `proposals`, os triggers e as policies de RLS.
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Em **Authentication → URL Configuration**, adicione a URL do seu site
   (local ou de produção) em *Site URL* e *Redirect URLs* (ex:
   `http://localhost:3000/**` em desenvolvimento).
5. (Opcional, recomendado) Em **Authentication → Providers → Email**, ajuste
   se quer exigir confirmação de e-mail antes do primeiro login.

## Rodando localmente

```bash
cp .env.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Suba este diretório (`marketplace/`) como o *root directory* do projeto na
   Vercel.
2. Configure as mesmas variáveis de `.env.example` em
   **Settings → Environment Variables**, com `NEXT_PUBLIC_SITE_URL` apontando
   para o domínio final (usado no link de confirmação de e-mail).
3. Atualize *Redirect URLs* no Supabase com o domínio de produção.

Qualquer outra plataforma que rode Next.js (App Router, Node runtime) também
funciona — não há dependência específica da Vercel.

## Tipos gerados pelo Supabase (recomendado, não obrigatório)

Este projeto usa tipos escritos à mão em `src/lib/database.types.ts` em vez
de tipos gerados, para não depender de um projeto Supabase real durante o
desenvolvimento inicial. Depois de criar seu projeto, você pode gerar tipos
completos e ligá-los aos clients para checagem de tipo mais forte nas
queries:

```bash
npx supabase gen types typescript --project-id <seu-project-id> > src/lib/database.types.ts
```

Se fizer isso, volte a passar `Database` como generic em
`src/lib/supabase/client.ts` e `src/lib/supabase/server.ts`
(`createBrowserClient<Database>(...)` / `createServerClient<Database>(...)`).

## Estrutura

```
src/
  app/
    (marketing)/        landing, catálogo, entrar, cadastro — com header/footer públicos
    dashboard/           área logada (protegida pelo proxy.ts), com sidebar
    actions/              server actions (auth, listings, proposals, profile)
    auth/confirm/         handler de confirmação de e-mail do Supabase
  components/            componentes de UI compartilhados
  lib/
    supabase/             clients (browser, server, proxy/middleware)
    queries/               leituras de dados (catálogo, dashboard)
    constants.ts, format.ts, database.types.ts
supabase/migrations/     schema SQL + RLS policies
proxy.ts                  substitui o antigo middleware.ts no Next 16; protege /dashboard
```

## O que falta para produção

- Upload de documentos do processo (usar Supabase Storage).
- Verificação de identidade/KYC para vendedores e compradores.
- Notificações por e-mail quando uma proposta é enviada/respondida.
- Fluxo de formalização da cessão (fora do escopo de um marketplace — hoje a
  plataforma só conecta as partes, quem finaliza a operação são elas).
- Página de aviso legal/termos de uso mais completa, revisada por um
  advogado — o texto atual no rodapé é um placeholder.

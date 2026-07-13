# Meridiano Matemática

App web (PWA) de ensino de matemática e estatística, do Ensino
Fundamental ao Superior, com teoria, calculadora gráfica, exercícios em
4 níveis de dificuldade e gamificação.

Por ser um PWA, funciona em qualquer navegador e pode ser instalado na
tela inicial no iOS e Android como um app nativo — sem precisar de loja
de aplicativos.

## Estado atual

- **Ensino Fundamental II** (7 tópicos: números inteiros, frações,
  álgebra, potenciação/radiciação, proporcionalidade/porcentagem,
  equações do 2º grau, geometria plana), cada um com 24 exercícios
  divididos em 4 níveis de dificuldade (Fácil/Médio/Difícil/Olimpíada),
  escolhidos livremente pelo aluno.
- **Ensino Médio** — começando com "Função do 1º Grau" (coeficientes,
  raiz, gráfico), também em 4 níveis de dificuldade. Mais tópicos
  (trigonometria, geometria analítica) entram nos próximos ciclos.
- **Estatística** — trilha independente com 3 níveis (Iniciante:
  medidas de tendência central; Intermediário: probabilidade básica;
  Avançado: distribuição normal e escore-z).
- Fundamental I, Ensino Superior e Econometria aparecem como "em breve"
  — a estrutura de dados (`src/data/curriculum.ts`) já suporta
  adicionar novos níveis e tópicos sem mudar a arquitetura.
- **Calculadora gráfica** (`/calculadora`) com parser de expressões
  próprio (sem `eval`), zoom e navegação por arraste.
- **Gamificação**: XP por resposta certa (escalado por dificuldade),
  níveis, sequência (streak) diária e conquistas.
- **Dashboard de progresso** (`/progresso`) com gráficos de desempenho
  por tópico e XP ao longo do tempo.
- Progresso e gamificação salvos localmente no navegador
  (`localStorage`) — funciona sem conta (modo convidado).
- **Contas (opcional)**: login/cadastro (`/entrar`, `/cadastro`) via
  Supabase Auth sincronizam XP, progresso e conquistas na nuvem entre
  dispositivos. Sem configurar o Supabase, o app roda 100% em modo
  local — nada quebra. Veja "Configurando contas (Supabase)" abaixo.
- **Resolver por foto** (`/foto`, exclusivo para quem tem conta): o
  aluno fotografa um problema de matemática e recebe a solução passo a
  passo, gerada pela Claude API (visão). Veja "Configurando resolver
  por foto" abaixo.
- **Quadro de rascunho** (`/quadro`): quadro negro digital — desenhar
  com mouse, dedo ou caneta (cores, espessura, borracha, desfazer,
  baixar como PNG). Aberto a todos, sem conta; o botão "Resolver com
  IA" (que reaproveita o mesmo pipeline do "resolver por foto") exige
  login. Reconhecimento de escrita à mão ao vivo (convertendo os
  traços em equação enquanto o aluno escreve) é um item futuro — hoje
  a IA analisa uma imagem estática do quadro, não os traços em tempo
  real.
- **Modo escuro**: alternância clara/escura no menu, com detecção da
  preferência do sistema e persistência em `localStorage`. Sem "flash"
  de tema errado ao carregar a página (script inline aplicado antes da
  primeira renderização).
- **Idioma** (Português/English/Español): seletor no menu troca o
  texto de toda a navegação, páginas e mensagens de erro (`src/i18n/`).
  A escolha fica salva em cookie, então funciona em Server Components
  também (Navbar, cabeçalhos de página etc.) — veja "Sobre o idioma"
  abaixo para o que ainda **não** é traduzido.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configurando contas (Supabase)

Contas são opcionais — o app funciona normalmente sem elas. Para
habilitar login e sincronização de progresso:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **Settings → API**, copie a **Project URL** e a **anon/public key**.
3. Copie `.env.local.example` para `.env.local` e preencha as duas
   variáveis (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. No **SQL Editor** do painel do Supabase, rode o conteúdo de
   `supabase/schema.sql` (cria as tabelas `profiles`, `topic_progress` e
   `gamification_state`, todas com Row Level Security — cada usuário só
   acessa os próprios dados).
5. Reinicie o servidor (`npm run dev`). O link "Entrar" no topo passa a
   funcionar.

Como funciona: o progresso continua sendo salvo primeiro no
`localStorage` (rápido, funciona offline). Se o usuário está logado,
cada mudança também é replicada em segundo plano para o Supabase
(`src/lib/cloudSync.ts`). No login, se a conta já tiver dados na nuvem,
eles substituem os locais (sincronização entre dispositivos); se for o
primeiro login, o progresso local (de convidado) é enviado para a
nuvem, sem perda.

> Nesta versão do Next.js, "Middleware" foi renomeado para "Proxy"
> (arquivo `proxy.ts`, função `proxy`) — é isso que mantém a sessão do
> Supabase atualizada a cada requisição.

## Configurando resolver por foto

Exige contas (Supabase) já configuradas (passo anterior) e uma chave da
Claude API:

1. Crie uma chave em [console.anthropic.com](https://console.anthropic.com).
2. Adicione `ANTHROPIC_API_KEY=...` ao `.env.local`.
3. Reinicie o servidor. O link "Resolver por foto" no topo passa a
   funcionar para usuários logados.

Sem `ANTHROPIC_API_KEY` configurada, a página `/foto` continua
acessível mas a rota `/api/resolver-foto` responde com erro — o resto
do app não é afetado.

Cada usuário logado tem um limite de 15 fotos resolvidas por dia
(`increment_photo_usage` em `supabase/schema.sql`, aplicado de forma
atômica no banco) — proteção simples contra abuso, já que cada chamada
tem custo real de API. O mesmo limite vale para o botão "Resolver com
IA" do quadro de rascunho, já que os dois usam a mesma rota
(`/api/resolver-foto`).

## Sobre o idioma

O seletor de idioma (`src/i18n/`) traduz toda a navegação e as páginas
de nível superior: menu, home, login/cadastro, resolver por foto e
quadro de rascunho, em Português/English/Español. A arquitetura é
simples de propósito — dicionários (`src/i18n/dictionaries.ts`) mais um
cookie (lido por Server e Client Components), sem reescrever rotas com
prefixo de idioma (`/en/...`).

**O que ainda não é traduzido** (fica em português por enquanto):

- O conteúdo do currículo em si (teoria e enunciados de exercícios em
  `src/data/curriculum.ts`) — traduzir isso com qualidade pedagógica é
  um projeto de conteúdo à parte, do mesmo porte de adicionar um nível
  novo, não algo que dá para fazer bem em lote.
- O motor de exercícios (`ExerciseQuiz`, `DifficultyPicker`) e o
  dashboard de progresso — mexer neles quebraria dezenas de testes e2e
  que hoje verificam texto exato em português; fica como próximo passo
  se decidirmos ir além da navegação.
- Mensagens de erro de autenticação (vêm prontas do Supabase via
  `src/app/actions/auth.ts`).

Isso significa: hoje dá para navegar o app inteiro em inglês/espanhol,
mas ao entrar numa trilha e resolver exercícios, o conteúdo continua em
português.

## Testes

```bash
npm test          # testes unitários (Vitest) — lógica pura
npm run test:watch
npm run test:e2e  # testes end-to-end (Playwright) — builda, sobe o app e testa no navegador
```

Os testes unitários cobrem o parser de expressões da calculadora, a
lógica de gamificação (XP/streak/badges) e a integridade dos dados do
currículo (ids únicos, todo exercício de múltipla escolha tem a
resposta entre as opções, etc.).

O teste e2e mais importante é `e2e/exercises-correctness.spec.ts`: ele
lê o currículo diretamente, preenche cada exercício com sua própria
resposta (`exercise.answer`) e confirma que o app marca como
"Certinho!" — isto é, toda vez que um exercício é adicionado ou editado,
rodar `npm run test:e2e` confere automaticamente que a correção
continua funcionando para ele.

O CI (`.github/workflows/ci.yml`) roda lint, testes unitários e e2e em
todo push e pull request.

## Estrutura

- `src/data/curriculum.ts` — conteúdo: níveis, tópicos, teoria e
  exercícios (com campo `difficulty`).
- `src/lib/progress.ts` — progresso por tópico e dificuldade no
  `localStorage`.
- `src/lib/gamification.ts` — XP, streak e badges.
- `src/lib/mathExpr.ts` — parser/avaliador de expressões matemáticas
  para a calculadora gráfica.
- `src/components/PracticeSection.tsx` + `DifficultyPicker.tsx` +
  `ExerciseQuiz.tsx` — seleção de dificuldade e motor de exercícios.
- `public/manifest.json`, `public/sw.js` — configuração PWA (instalável,
  cache de app shell).
- `src/lib/supabase/` — clientes Supabase (browser/server) e refresh de
  sessão; `src/lib/cloudSync.ts` — sincronização de progresso/XP com a
  nuvem quando logado.
- `src/app/api/resolver-foto/route.ts` + `src/components/PhotoSolver.tsx`
  — rota e UI de "resolver por foto" (Claude API com visão).
- `src/components/DrawingCanvas.tsx` + `QuadroBoard.tsx` — quadro de
  rascunho (canvas livre) e o botão "Resolver com IA", que reaproveita
  `/api/resolver-foto` exportando o desenho como PNG.
- `supabase/schema.sql` — esquema do banco (tabelas + RLS).
- `src/i18n/` — seletor de idioma: dicionários, cookie de locale
  (`getServerLocale.ts` para Server Components, `LanguageContext.tsx`
  para Client Components) e `src/components/LanguageSwitcher.tsx`.
- `src/components/ThemeToggle.tsx` — alternância de modo escuro,
  variáveis de cor em `src/app/globals.css` (`:root[data-theme="dark"]`).
- `e2e/` — testes end-to-end (Playwright).

## Adicionando conteúdo

Para adicionar um tópico a uma trilha existente, edite o array de
tópicos correspondente em `src/data/curriculum.ts` seguindo o formato de
`Topic` (teoria + exercícios, cada exercício com um `difficulty`). Para
habilitar um novo nível de ensino, marque `available: true` em `levels`,
crie o array de tópicos dele e registre-o em `TOPICS_BY_LEVEL`. Depois
de editar conteúdo, rode `npm run test:e2e` para confirmar que os
gabaritos continuam corretos.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Contas/banco de dados:
Supabase (opcional). IA (resolver por foto): Claude API (opcional).
Testes: Vitest (unitário) + Playwright (e2e).

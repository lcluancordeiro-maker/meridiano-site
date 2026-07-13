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
- **Estatística** — trilha independente com 3 níveis (Iniciante:
  medidas de tendência central; Intermediário: probabilidade básica;
  Avançado: distribuição normal e escore-z).
- Fundamental I, Ensino Médio, Ensino Superior e Econometria aparecem
  como "em breve" — a estrutura de dados (`src/data/curriculum.ts`) já
  suporta adicionar novos níveis e tópicos sem mudar a arquitetura.
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
- `supabase/schema.sql` — esquema do banco (tabelas + RLS).
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
Supabase (opcional). Testes: Vitest (unitário) + Playwright (e2e).

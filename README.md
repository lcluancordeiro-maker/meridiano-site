# Meridiano Matemática

App web (PWA) de ensino de matemática, do Ensino Fundamental ao Superior,
com teoria e exercícios interativos corrigidos na hora.

Por ser um PWA, funciona em qualquer navegador e pode ser instalado na
tela inicial no iOS e Android como um app nativo — sem precisar de loja
de aplicativos.

## Estado atual (MVP)

- Trilha completa: **Ensino Fundamental II** (Operações com Números
  Inteiros, Frações, Introdução à Álgebra).
- Fundamental I, Ensino Médio e Ensino Superior aparecem como "em breve"
  na tela inicial — a estrutura de dados (`src/data/curriculum.ts`) já
  suporta adicionar novos níveis e tópicos.
- Progresso do usuário salvo localmente no navegador (`localStorage`),
  sem necessidade de conta.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

- `src/data/curriculum.ts` — conteúdo: níveis, tópicos, teoria e exercícios.
- `src/lib/progress.ts` — leitura/escrita do progresso no `localStorage`.
- `src/components/ExerciseQuiz.tsx` — motor de exercícios com correção
  instantânea.
- `public/manifest.json`, `public/sw.js` — configuração PWA (instalável,
  cache de app shell).

## Adicionando conteúdo

Para adicionar um novo tópico a uma trilha existente, edite o array de
tópicos correspondente em `src/data/curriculum.ts` seguindo o formato de
`Topic` (teoria + exercícios). Para habilitar um novo nível de ensino,
marque `available: true` em `levels` e crie o array de tópicos dele.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS.

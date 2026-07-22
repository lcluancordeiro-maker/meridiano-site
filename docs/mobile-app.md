# App nativo (iOS/Android) via Capacitor

Este repositório traz a **configuração** de um wrapper nativo
([Capacitor](https://capacitorjs.com)) — `capacitor.config.ts` e as
dependências `@capacitor/core`/`@capacitor/cli`. Ele **não contém** um
binário compilado nem os projetos de plataforma (`ios/`, `android/`):
gerar e testar esses projetos exige Xcode (macOS) e/ou Android Studio,
que não existem neste ambiente sandbox. Este documento é o "próximo
passo real" para quem for continuar a partir daqui numa máquina com
essas ferramentas.

## Por que `server.url` e não um build estático

Meridiano Matemática é renderizado no servidor (rotas dinâmicas, server
actions, streaming em `/api/tutor`, route handlers como
`/certificado/[levelId]`) — não é uma SPA estática, então não dá para
usar o modo mais comum do Capacitor (empacotar `out/` como os assets
web do app). Em vez disso, `capacitor.config.ts` usa `server.url`
apontando para o deploy já hospedado (a mesma `NEXT_PUBLIC_SITE_URL`
que `src/lib/siteUrl.ts` usa para metadata/SEO): o app nativo é
essencialmente uma WebView carregando o site real, com acesso às APIs
nativas que os plugins do Capacitor expõem (câmera, notificações
push, etc. — nenhum plugin foi adicionado ainda além do `core`).

## Passo a passo para gerar um build de verdade

Em uma máquina com Node, Xcode (para iOS) e/ou Android Studio (para
Android) instalados:

1. `NEXT_PUBLIC_SITE_URL` precisa apontar para o domínio de produção
   real antes de gerar as plataformas — `capacitor.config.ts` lê essa
   env var em build-time; sem ela, cai num placeholder
   (`https://meridiano-math.example.com`) que não serve pra nada.
2. `npx cap add ios` e/ou `npx cap add android` — gera os projetos
   nativos (`ios/App/`, `android/`) a partir de `capacitor.config.ts`.
   Isso baixa o CocoaPods/Gradle wrapper e cria os projetos Xcode/Gradle
   completos; não é algo que se possa simular sem as ferramentas.
3. `npx cap sync` sempre que `capacitor.config.ts` mudar ou um plugin
   novo for adicionado — copia a config pros projetos nativos.
4. `npx cap open ios` / `npx cap open android` — abre no Xcode/Android
   Studio para rodar num simulador/dispositivo, ajustar ícone/splash
   screen (hoje só existem os ícones do PWA em `public/icon-*.png`,
   que servem de ponto de partida mas precisam ser regerados nos
   tamanhos que cada plataforma exige), e eventualmente gerar o
   binário assinado para a App Store / Google Play.

## O que falta além disso

- **Push notifications nativas**: hoje o app usa Web Push
  (`src/lib/push/`, ver [docs/features.md](./features.md)) — funciona
  dentro da WebView em Android, mas iOS via WebView tem suporte mais
  limitado a Web Push; o caminho nativo de verdade seria o plugin
  `@capacitor/push-notifications` + APNs/FCM, que não está configurado.
- **Ícones/splash screen** dedicados por plataforma (`@capacitor/assets`
  gera os tamanhos a partir de uma imagem-fonte).
- **Contas de desenvolvedor** da Apple e Google (obrigatórias para
  publicar), certificados de assinatura, e a revisão de cada loja.
- Nenhum teste automatizado cobre o wrapper nativo (não teria como,
  sem os projetos de plataforma) — a suite de e2e existente
  (`e2e/`, Playwright) continua cobrindo o comportamento web, que é o
  que a WebView carrega.

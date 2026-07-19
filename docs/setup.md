# Configurando integrações

Guias de configuração de cada integração opcional do Meridiano
Matemática. Todas são independentes — sem configurar nenhuma, o app
funciona 100% em modo local (sem contas, sem sincronização, sem
recursos sociais). Veja o [README](../README.md) para a visão geral do
projeto e ["Sobre as funcionalidades"](./features.md) para como cada
recurso funciona por dentro.

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

### Login com Google, Microsoft, GitHub e Apple

Além de e-mail/senha, `/entrar` e `/cadastro` mostram os botões
"Continuar com Google", "Continuar com Microsoft", "Continuar com
GitHub" e "Continuar com Apple" — quem já tem uma dessas contas não
precisa criar senha nova. Funciona via OAuth do Supabase Auth; a conta
é criada automaticamente no primeiro login com qualquer um deles.

Para habilitar (com o Supabase já configurado acima):

1. **Google**: crie um OAuth Client ID em
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (tipo "Web application"). Em **Authorized redirect URIs**, adicione a
   Callback URL que o Supabase mostra no passo 5.
2. **Microsoft**: registre um app em
   [Azure Portal → App registrations](https://portal.azure.com) e crie
   um client secret. Em **Redirect URI**, use a mesma Callback URL do
   Supabase (plataforma "Web").
3. **GitHub**: crie um OAuth App em
   [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers).
   Em **Authorization callback URL**, use a mesma Callback URL do
   Supabase.
4. **Apple**: exige uma conta paga no
   [Apple Developer Program](https://developer.apple.com/programs/) —
   crie um **Services ID** (não o App ID), com "Sign in with Apple"
   habilitado, e uma chave privada (.p8) para gerar o client secret
   (JWT assinado). É o provedor mais trabalhoso de configurar dos
   quatro; o [guia do Supabase para Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple)
   detalha o passo a passo.
5. No painel do Supabase, em **Authentication → Providers**, habilite
   **Google**, **Azure**, **GitHub** e **Apple**, e cole o Client
   ID/Secret de cada um. O Supabase mostra, em cada provedor, a
   **Callback URL** a usar nos passos 1 a 4 (algo como
   `https://<seu-projeto>.supabase.co/auth/v1/callback`).
6. Em **Authentication → URL Configuration**, adicione a URL do seu app
   (ex.: `http://localhost:3000` em desenvolvimento, ou o domínio de
   produção) em **Redirect URLs** — é para lá que o Supabase manda o
   usuário de volta depois do login (rota `/auth/callback` no app, que
   troca o código por uma sessão).

Sem esses provedores habilitados, os botões continuam visíveis mas o
login retorna um erro amigável — nada quebra. `src/app/actions/auth.ts`
(`signInWithGoogle`/`signInWithMicrosoft`/`signInWithGitHub`/`signInWithApple`)
e `src/app/auth/callback/route.ts` concentram toda a lógica.

> Nesta versão do Next.js, "Middleware" foi renomeado para "Proxy"
> (arquivo `proxy.ts`, função `proxy`) — é isso que mantém a sessão do
> Supabase atualizada a cada requisição.

### Login biométrico (Face ID / Touch ID / Windows Hello)

Não existe uma "API do Face ID" para a web — o que o navegador expõe é
o **WebAuthn** (padrão de passkeys), e é o sistema operacional quem
decide qual biometria usar como autenticador de plataforma: Face
ID/Touch ID no macOS/iOS/Safari, Windows Hello no Windows, biometria
nativa no Android/Chrome. `/entrar` mostra o botão "Entrar com Face
ID / Touch ID" só quando `navigator.credentials` reporta um
autenticador de plataforma disponível (`PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`)
— em desktops sem biometria, ou navegadores sem suporte, o botão nem
aparece.

Como funciona:

- **Entrar** (`src/components/PasskeyLoginButton.tsx`, em `/entrar`):
  chama `supabase.auth.signInWithPasskey()`, que dispara o prompt
  nativo de biometria do dispositivo e cria a sessão direto — não
  precisa de servidor próprio nem de `navigator.credentials.get()`
  manual, o SDK do Supabase cuida da cerimônia WebAuthn inteira.
- **Cadastrar uma biometria** (`src/components/PasskeyManager.tsx`, em
  `/conta`, exige estar logado): chama `supabase.auth.registerPasskey()`
  para registrar o dispositivo atual, e lista/remove passkeys já
  cadastradas via `supabase.auth.passkey.list()`/`.delete()`.

Isso usa a API de passkeys do `@supabase/supabase-js`
(`auth.experimental.passkey`, habilitado em `src/lib/supabase/client.ts`)
— **marcada como experimental** pelo próprio Supabase; a assinatura
pode mudar em versões futuras do SDK. Pode ser necessário habilitar
passkeys explicitamente nas configurações do seu projeto Supabase
(**Authentication → Providers** ou **Authentication → Passkeys**,
dependendo da versão do painel) antes de funcionar em produção.

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

Cada usuário logado tem um limite diário de fotos resolvidas —
5/dia no plano grátis, 30/dia no Premium (`increment_photo_usage` em
`supabase/schema.sql`, aplicado de forma atômica no banco) — proteção
simples contra abuso, já que cada chamada tem custo real de API. O
mesmo limite vale para o botão "Resolver com IA" do quadro de
rascunho, já que os dois usam a mesma rota (`/api/resolver-foto`).

## Configurando o tutor de IA (Gauss)

Usa a mesma `ANTHROPIC_API_KEY` configurada acima — nenhuma variável
nova. Sem ela (ou sem contas configuradas), o chat continua aparecendo
mas mostra a mensagem de indisponível/login em vez do bate-papo.

Igual ao "resolver por foto", cada usuário logado tem um limite diário
de mensagens — 15/dia no plano grátis, 60/dia no Premium
(`increment_tutor_usage` em `supabase/schema.sql`). O prompt de sistema
(`src/lib/tutor/systemPrompt.ts`) instrui o modelo a nunca entregar a
resposta de um exercício de primeira — o objetivo é o aluno chegar lá
com perguntas guiadas, não só receber a solução pronta (o mesmo
espírito das dicas de erro comum, ver "Sobre as funcionalidades"). O
componente (`src/components/TutorChat.tsx`) hoje não sabe em qual
trilha/tópico o aluno está — o prompt instrui o Gauss a perguntar, mas
passar esse contexto automaticamente é um possível próximo passo.

Não testado com uma conversa real nesta sessão (sem
`ANTHROPIC_API_KEY` configurada aqui).

## Configurando assinaturas (Stripe)

Exige contas (Supabase) já configuradas. Assinaturas são opcionais —
sem configurar, o conteúdo Premium fica bloqueado para todo mundo, mas
o resto do app funciona normalmente:

1. Crie uma conta em [dashboard.stripe.com](https://dashboard.stripe.com)
   (comece com as chaves de **teste**, no modo "Test mode").
2. Em **Product catalog**, crie um produto "Premium" com um **Preço**
   recorrente (mensal ou anual) e copie o ID do preço (`price_...`).
3. Em **Developers → API keys**, copie a **Secret key**.
4. Em **Developers → Webhooks**, adicione um endpoint apontando para
   `https://SEU_DOMINIO/api/stripe/webhook`, com os eventos
   `checkout.session.completed`, `customer.subscription.updated` e
   `customer.subscription.deleted` — copie o **Signing secret**.
5. Em **Settings → API** do Supabase, copie a chave **service_role**
   (nunca a exponha no cliente).
6. Preencha `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `STRIPE_PREMIUM_PRICE_ID` e `SUPABASE_SERVICE_ROLE_KEY` no
   `.env.local`.
7. No **SQL Editor** do Supabase, rode `supabase/schema.sql` de novo
   (cria a tabela `subscriptions`, seguro de rodar mais de uma vez).
8. Reinicie o servidor. O link "Premium" no topo passa a permitir
   assinar.

Como funciona: o checkout usa a página hospedada da Stripe (sem
formulário de cartão no seu próprio site). O webhook recebe os
eventos e grava o status da assinatura na tabela `subscriptions` via
`service_role` (que ignora Row Level Security de propósito — é o
único jeito de gravar sem depender da sessão do navegador do
usuário). `src/lib/entitlements.ts` lê essa tabela para decidir se um
usuário tem acesso Premium.

**Quais trilhas são Premium**: veja o campo `premium` de cada nível em
`src/data/curriculum.ts`. Hoje são Estatística Intermediário e
Avançado, Matemática Financeira Avançado, Ensino Superior, Econometria,
Programação Avançado/Machine Learning, e os simulados UERJ, UNESP,
OBMEP e OIM (o ENEM fica grátis, como porta de entrada do
preparatório).

### Formas de pagamento

O checkout aceita **cartão** (crédito e débito — Stripe não distingue
os dois como métodos separados, isso depende só do cartão/banco do
cliente; cobre bandeiras internacionais automaticamente), **boleto**
e **Pix**, esses dois últimos apenas quando o preço do Premium está em
BRL (`src/app/api/stripe/checkout/route.ts` decide isso olhando a
moeda do Price no momento do checkout).

Dois detalhes importantes sobre renovação, que são limitações do
método de pagamento em si, não do código:

- **Boleto não renova sozinho.** Cada cobrança gera um boleto novo que
  o cliente precisa pagar manualmente; se não pagar, a assinatura cai
  para `past_due`/`unpaid` conforme as regras de cobrança configuradas
  no Dashboard da Stripe (Settings → Billing → Subscriptions and
  emails). Bom para quem não tem cartão, mas não é "fire and forget".
- **Pix usa mandato (Pix Automático)**, uma funcionalidade recente da
  Stripe: no primeiro pagamento o cliente autoriza a cobrança recorrente
  no app do banco dele, e as cobranças seguintes são automáticas dentro
  do valor autorizado — mas a confirmação de cada cobrança pode levar
  alguns dias, então o acesso Premium pode demorar um pouco a mais pra
  renovar depois de cada ciclo, comparado a cartão. Vale confirmar no
  Dashboard da Stripe se Pix Automático já está disponível pra sua
  conta antes de divulgar essa opção.

Nenhuma dessas duas formas foi testada com uma cobrança real nesta
sessão (sem chaves da Stripe configuradas aqui) — teste no modo de
teste da Stripe antes de ativar em produção.

## Configurando notificações push

Lembretes de sequência (streak) são opcionais — sem configurar, o
botão de ativar fica oculto e o resto do app funciona normalmente.
Requer contas (Supabase) já configuradas, porque a inscrição de push
fica salva por usuário.

1. Gere o par de chaves VAPID: `npx web-push generate-vapid-keys`.
2. Preencha `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` em
   `.env.local` com as chaves geradas, e `VAPID_SUBJECT` com um e-mail
   ou URL de contato (ex.: `mailto:voce@exemplo.com`) — exigido pelo
   protocolo Web Push.
3. Rode `supabase/schema.sql` de novo no SQL Editor do Supabase (cria
   a tabela `push_subscriptions`, se ainda não existir).
4. Escolha um `CRON_SECRET` (qualquer string aleatória longa) e
   preencha essa variável também.
5. Configure um agendador externo para chamar, uma vez por dia,
   `POST https://SEU_DOMINIO/api/push/send-streak-reminders` com o
   header `x-cron-secret: <seu CRON_SECRET>`. Esse endpoint varre a
   tabela `gamification_state` (via `service_role`) em busca de
   usuários cuja sequência foi estendida ontem — ou seja, quebra hoje
   se eles não praticarem — e envia um push a cada inscrição salva
   deles, removendo automaticamente inscrições expiradas (410/404).
   Qualquer agendador serve: um cron job de um provedor de hospedagem,
   um workflow do GitHub Actions com `schedule:`, ou até um serviço
   externo de "ping" HTTP diário.

Como funciona no navegador: `/progresso` mostra um botão "Ativar
lembretes" (`src/components/NotificationOptIn.tsx`) que pede permissão
de notificação, assina o `PushManager` do navegador e salva a inscrição
via `/api/push/subscribe`. O service worker (`public/sw.js`) escuta o
evento `push` e mostra a notificação; clicar nela abre `/progresso`.

Não testado com um envio real nesta sessão (sem chaves VAPID
configuradas aqui) — teste com uma inscrição de verdade antes de
agendar o cron em produção.

A mesma infraestrutura (chaves VAPID + `push_subscriptions`) também
notifica mensagens novas de chat e de comunidade — nenhuma variável
adicional é necessária. Diferente do lembrete de streak (que roda uma
vez por dia via cron), essa notificação é disparada na hora: depois
que `ChatThread.tsx`/`CommunityThread.tsx` insere a mensagem no
Supabase (o `insert` direto do navegador, para minimizar latência —
ver ["Sobre o chat"](./features.md#sobre-o-chat)), o navegador também
chama, sem esperar a resposta (`notifyNewMessage` em
`src/lib/pushNotifyMessage.ts`), `POST /api/push/notify-message`. Essa
rota reconfirma a mensagem pelo próprio Supabase do usuário logado
(garantindo que quem chamou é realmente quem enviou aquela mensagem —
não dá pra forjar um id de mensagem alheia para gerar spam de
notificação) e envia um push para todo participante/membro (menos quem
enviou).

**Limitações desta primeira versão**: sem preferência de silenciar
uma conversa/comunidade específica, e em comunidades grandes todo
membro recebe push a cada mensagem — pode ficar barulhento em
comunidades muito ativas. Um passo natural futuro é agregar várias
mensagens numa única notificação, ou permitir silenciar por
conversa/comunidade.

## Configurando verificação de identidade e consentimento dos responsáveis

Chat, comunidades e lives (ver ["Sobre as funcionalidades"](./features.md))
são recursos sociais que exigem verificação de identidade antes de
liberar — tanto por segurança quanto para proteger menores de idade. Em
vez de tentar construir um scanner de documento/rosto por conta própria
(o que seria só teatro de segurança, ou uma tentativa inadequada de KYC
biométrico caseiro), essa verificação é feita pelo [Stripe
Identity](https://stripe.com/identity) — documento oficial + selfie com
prova de vida, processado pela Stripe. Sem configurar, a verificação (e
tudo que depende dela) fica indisponível, mas o resto do app funciona
normalmente.

1. No dashboard da Stripe, ative o produto "Identity".
2. Em **Developers → Webhooks**, adicione um **segundo** endpoint
   (separado do de assinaturas) para
   `https://SEU_DOMINIO/api/identity/webhook`, com os eventos
   `identity.verification_session.verified`,
   `identity.verification_session.requires_input` e
   `identity.verification_session.canceled` — copie o "Signing secret"
   em `STRIPE_IDENTITY_WEBHOOK_SECRET`. Reaproveita `STRIPE_SECRET_KEY`
   (o mesmo das assinaturas).
3. Rode `supabase/schema.sql` de novo (cria `identity_verifications` e
   `parent_consents`).
4. (Opcional, mas recomendado) crie uma conta em
   [resend.com](https://resend.com), verifique um domínio remetente e
   preencha `RESEND_API_KEY`/`RESEND_FROM_EMAIL` — sem isso, o link de
   consentimento dos responsáveis é gerado e salvo, mas nenhum e-mail é
   enviado de verdade (você teria que buscar o link manualmente no
   banco para testar).

Como funciona: em `/verificar-identidade`, o usuário inicia uma
`VerificationSession` da Stripe Identity (documento oficial + selfie).
O webhook recebe o resultado e extrai a data de nascimento verificada
(`verified_outputs.dob`) — não confiamos em nenhuma data autodeclarada
pelo usuário. Se a idade calculada (`src/lib/identity/age.ts`) for
menor que 18 anos, o status vira `verified_minor` em vez de `verified`,
e a liberação de chat/comunidades/lives fica bloqueada até um
responsável confirmar consentimento: o menor informa o e-mail do
responsável, o app gera um token aleatório e envia um link de
confirmação (`/consentimento/[token]`) — esse fluxo é inspirado no
"verifiable parental consent" da COPPA americana, embora este app não
seja necessariamente sujeito a essa lei especificamente (verifique com
um advogado quais leis de proteção a menores se aplicam à sua
jurisdição antes de operar isso com usuários reais). Nenhum documento
de identidade ou imagem de selfie é armazenado neste banco — tudo isso
fica só do lado da Stripe; guardamos apenas o status e a data de
nascimento extraída. Não testado com uma conta Stripe Identity real
nesta sessão — teste uma verificação de ponta a ponta antes de contar
com isso em produção.

## Configurando as lives (LiveKit Cloud)

Lives (ver ["Sobre as funcionalidades"](./features.md#sobre-as-lives))
usam a [LiveKit Cloud](https://cloud.livekit.io) para a transmissão de
vídeo/áudio de verdade — este app só guarda metadados (quem, quando,
título). Sem configurar, `/lives` fica indisponível, mas o resto do app
funciona normalmente.

1. Crie um projeto em [cloud.livekit.io](https://cloud.livekit.io).
2. Em **Settings → Keys**, copie a API Key e o API Secret para
   `LIVEKIT_API_KEY`/`LIVEKIT_API_SECRET`.
3. Copie a "Project URL" (formato `wss://SEU-PROJETO.livekit.cloud`)
   para `NEXT_PUBLIC_LIVEKIT_URL` — essa URL é usada pelo navegador
   para conectar na sala, por isso é pública.

Como as lives também são um recurso social, valem as mesmas exigências
de verificação de identidade descritas acima. Não testado com uma
conta LiveKit Cloud real nesta sessão — teste uma chamada de ponta a
ponta (dois navegadores/dispositivos diferentes) antes de contar com
isso em produção.

## Preparando para produção

Quatro peças de "prontidão para produção" — domínio próprio, SEO,
monitoramento de erros e analytics. Todas são opcionais: sem
configurar nada, o app funciona normalmente (só que com URLs
`localhost` no sitemap e sem monitoramento/analytics).

### Domínio próprio

Isso depende do seu provedor de hospedagem e registrador de domínio —
não é algo que dá pra automatizar por código. Passos gerais:

1. Registre um domínio (ex.: em registro.br, se for `.com.br`).
2. No painel do seu provedor de hospedagem (Vercel, Netlify etc.),
   adicione o domínio ao projeto — ele vai indicar os registros DNS
   (geralmente um `A`/`ALIAS` para a raiz e um `CNAME` para `www`).
3. Cadastre esses registros no painel do seu registrador. A propagação
   DNS pode levar de minutos a até 48h.
4. Preencha `NEXT_PUBLIC_SITE_URL` com a URL final (ex.:
   `https://meridianomatematica.com.br`) — o sitemap, o robots.txt e as
   tags OpenGraph passam a usar essa URL em vez de `localhost:3000`.

### SEO

Sem configurar nada além do domínio acima, o app já expõe:

- `/sitemap.xml` (`src/app/sitemap.ts`) — gerado a partir de
  `src/data/curriculum.ts`: a home, páginas estáticas (calculadora,
  quadro, etc.) e uma URL para cada trilha/tópico disponível
  (`available: true`). Trilhas "em breve" ficam de fora.
  `src/app/sitemap.test.ts` cobre esse comportamento.
- `/robots.txt` (`src/app/robots.ts`) — libera tudo, exceto `/api/`,
  `/auth/callback` e `/progresso` (uma página pessoal, sem valor pra
  indexação), e aponta pro sitemap acima.
- Metadados OpenGraph/Twitter e `metadataBase` (`src/app/layout.tsx`),
  usados por WhatsApp/redes sociais ao gerar a prévia de um link
  compartilhado, e um título com template (`%s — Meridiano
  Matemática`) pra páginas que definirem seu próprio `title`.

### Monitoramento de erros (Sentry)

Sem configurar, nenhum evento é enviado — o app funciona normalmente.

1. Crie uma conta e um projeto Next.js em [sentry.io](https://sentry.io)
   e copie o DSN do projeto.
2. Preencha `NEXT_PUBLIC_SENTRY_DSN` e `SENTRY_DSN` (mesmo valor nas
   duas) em `.env.local`.
3. Reinicie o servidor.

Como funciona: `instrumentation-client.ts` (erros/performance no
navegador) e `instrumentation.ts` (`register()` para erros de
servidor, `onRequestError` para erros de Server Components/rotas)
inicializam o SDK do Sentry só se o DSN estiver definido — sem ele,
essas funções retornam imediatamente e o `@sentry/nextjs` fica
instalado, mas inerte. Não testado com um DSN de verdade nesta sessão
(sem conta Sentry configurada aqui) — verifique um erro de teste
chegando ao painel antes de confiar no monitoramento em produção.

### Analytics

Sem configurar, nenhum script de analytics é carregado. O app suporta
qualquer serviço compatível com o formato de script do
[Plausible](https://plausible.io) (cookieless, sem consentimento de
cookies necessário) — incluindo instâncias próprias/[Umami](https://umami.is)
que imitam esse formato.

1. Crie um site em plausible.io (ou rode sua própria instância) e
   copie o domínio cadastrado lá (geralmente igual ao
   `NEXT_PUBLIC_SITE_URL`, sem o `https://`).
2. Preencha `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` em `.env.local`.
3. Só se você hospedar seu próprio Plausible/Umami: preencha também
   `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` apontando pro `script.js` do seu
   servidor (sem essa variável, usa o script oficial do plausible.io).

Como funciona: `src/components/Analytics.tsx` renderiza um `<Script>`
carregando o `script.js` do Plausible só quando o domínio está
configurado — sem ele, o componente não renderiza nada.

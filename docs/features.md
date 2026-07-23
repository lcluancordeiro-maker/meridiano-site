# Sobre as funcionalidades

Como cada recurso funciona por dentro — para quem for mexer no código,
não um guia de configuração (isso está em [docs/setup.md](./setup.md)).
Veja o [README](../README.md) para a visão geral do projeto.

## Sobre o chat

`/chat` (link no menu) é um chat 1:1 e em grupo, estilo WhatsApp,
exigindo verificação de identidade (`granted`, ver
[docs/setup.md](./setup.md#configurando-verificação-de-identidade-e-consentimento-dos-responsáveis))
para usar. Iniciar uma conversa é pelo e-mail da outra pessoa (não
existe busca/listagem de usuários — só confirma se aquele e-mail
específico tem conta, via a RPC `find_user_by_email`, o mesmo tipo de
checagem usada num fluxo de "esqueci minha senha"). Um grupo aceita
vários e-mails separados por vírgula.

Como funciona: `src/app/actions/chat.ts` cria a conversa (RPCs
`find_or_create_direct_conversation`/`create_group_conversation`, que
evitam duplicar uma conversa 1:1 já existente); `ChatThread.tsx`
(client) assina o canal Realtime do Supabase
(`postgres_changes`/INSERT em `dm_messages`, filtrado por
`conversation_id`) para receber mensagens novas ao vivo, e envia
mensagens com um `insert` direto do navegador (sem round-trip por uma
Server Action) para minimizar a latência percebida. Como a tabela
`profiles` só permite a cada usuário ler a própria linha (RLS), mostrar
o nome de quem está do outro lado da conversa exige RPCs `security
definer` dedicadas (`list_my_conversations`, `get_conversation_header`,
`get_conversation_participants`) — mesmo padrão já usado em
`get_turma_roster` para turmas.

**Limitações desta primeira versão**: sem edição/exclusão de mensagem,
sem indicador de "digitando...", sem confirmação de leitura, sem
upload de imagem/arquivo (só texto), e sem paginação do histórico (todas
as mensagens da conversa são carregadas de uma vez — ok para o volume
esperado agora, mas um ponto a revisar se conversas ficarem muito
longas). Cotas de Premium (nº de grupos, tamanho de grupo) ainda não
são aplicadas aqui — é um próximo passo natural.

## Sobre as comunidades

`/comunidades` (link no menu) são grupos de estudo persistentes, com
chat próprio, também exigindo verificação de identidade (`granted`)
para usar. Diferente do chat 1:1/grupo, uma comunidade tem: um código
de entrada (`join_code`, gerado com `generateJoinCode()`, o mesmo
gerador já usado nas turmas), opção de ser pública (listada em
"Descobrir comunidades públicas" para qualquer verificado entrar sem
código) ou privada (só entra quem tiver o código), e um limite opcional
de membros.

Limites do plano gratuito: um usuário free pode **criar** no máximo
`FREE_COMMUNITY_LIMIT = 1` comunidade (checado contando linhas em
`communities` por `creator_id` em `src/app/actions/communities.ts`), e
uma comunidade criada por um usuário free tem um teto de
`FREE_MEMBER_CAP = 20` membros (aplicado dentro da RPC `join_community`,
que recusa a entrada com o erro `community_full` quando o teto é
atingido). Comunidades criadas por assinantes Premium não têm limite de
membros (`member_cap` nulo). Não há limite para **entrar** em
comunidades de outras pessoas, seja free ou Premium.

Como funciona: `create_community` (RPC `security definer`) cria a
comunidade e já insere o criador como `role='owner'` na mesma
transação — evita o problema de "ovo e galinha" de `community_members`
não ter política de insert direta (toda entrada de membro passa pela
RPC `join_community`, que também é quem checa o `member_cap`).
`CommunityThread.tsx` é uma cópia quase idêntica de `ChatThread.tsx`,
só trocando a tabela/canal Realtime para `community_messages`/
`community:{id}`. Mostrar nome e papel (owner/member) de cada membro
usa a mesma técnica de RPC `security definer` (`get_community_members`)
para contornar a RLS de `profiles`, igual ao chat.

**Limitações desta primeira versão**: sem papéis intermediários
(moderador), sem expulsar/banir membro, sem editar nome/descrição
depois de criada, e as mesmas limitações de mensagens do chat (sem
edição/exclusão, sem upload de arquivo, sem paginação).

## Sobre as lives

`/lives` (link no menu) são sessões de vídeo ao vivo, hospedadas na
LiveKit Cloud — este app nunca vê o vídeo/áudio bruto, só guarda
metadados (quem, quando, título, comunidade associada) na tabela
`live_sessions`. Assistir uma live exige a mesma verificação de
identidade (`granted`) do chat/comunidades e é **grátis** para
qualquer verificado; **hospedar** uma live (virar anfitrião) é um
recurso **Premium** — checado com `isPremiumUser()` em
`src/app/actions/lives.ts` antes de criar a sessão.

Como funciona: `createLive` gera um `room_name` único
(`live-{uuid}`) e insere a linha em `live_sessions` (a política de RLS
`live_sessions_insert` já garante que só o próprio host pode se
declarar host, e que uma live vinculada a uma comunidade exige ser
membro dela). A página `/lives/[roomName]` busca essa linha (RLS
`live_sessions_select` já filtra quem pode ver: o host, ninguém
vinculado a comunidade nenhuma, ou quem for membro da comunidade
associada) e renderiza `LiveRoom.tsx`, que busca um token de acesso em
`POST /api/livekit/token` (essa rota decide se o token permite
publicar vídeo/áudio — `canPublish` — comparando `live.host_id` com o
usuário logado; quem não é o host só recebe permissão de assistir) e
conecta na sala com `livekit-client` (`Room.connect`). O host tem
botões para ligar/desligar câmera e microfone
(`localParticipant.setCameraEnabled`/`setMicrophoneEnabled`) e um
botão "Encerrar live" que marca `ended_at` e redireciona para a lista.

**Limitações desta primeira versão**: sem gravação/replay da live, sem
chat de texto durante a transmissão, sem lista de espectadores, e o
layout de vídeo é uma grade simples (sem destaque automático de quem
está falando). Como não temos uma conta real da LiveKit Cloud
configurada neste ambiente de desenvolvimento, este fluxo não foi
testado contra o serviço de verdade — só o estado "não configurado" tem
cobertura de testes automatizados (veja `e2e/lives.spec.ts`).

## Sobre a moderação

Chat, grupos e comunidades precisam de um jeito de lidar com abuso —
principalmente considerando que parte dos usuários pode ser menor de
idade. Esta primeira versão cobre:

- **Denunciar mensagem**: um botão "Denunciar" em cada mensagem alheia
  (chat e comunidade) chama a RPC `report_message`, que confirma que
  quem denuncia realmente tinha acesso àquela mensagem antes de
  aceitar, e grava em `message_reports`. Denúncias são revisadas no
  painel `/admin/moderacao` (ver "Sobre o painel de moderação" abaixo).
- **Bloquear um contato**: no cabeçalho de uma conversa 1:1,
  "Bloquear esta pessoa" insere uma linha em `blocked_users`. A partir
  daí, a policy de RLS `dm_messages_insert` passa a recusar qualquer
  mensagem nova dessa pessoa em **qualquer** conversa que
  compartilhem — não é só uma cortina na tela, é aplicado no banco.
  `find_or_create_direct_conversation` também recusa iniciar uma nova
  conversa se a outra pessoa já bloqueou você. A lista de bloqueados
  fica em `/chat/bloqueados`, com opção de desbloquear.
- **Sair/remover de um grupo de chat**: qualquer participante sai por
  conta própria (`leave_group_conversation`); quem criou o grupo pode
  remover outros participantes (`remove_conversation_participant`) —
  mas não pode remover a si mesmo (para isso, basta sair).
- **Sair/remover de uma comunidade**: mesma lógica
  (`leave_community`/`remove_community_member`), só que o dono da
  comunidade não pode sair por essa via — sair deixaria a comunidade
  sem dono, então a única opção do dono é excluir a comunidade.

**Limitações desta primeira versão**: sem mute temporário (só
remoção definitiva de grupo/comunidade, ou banimento total dos
recursos sociais via painel de moderação), sem banimento que impeça
reentrar com um novo convite/link, sem aviso automático quando uma
denúncia atinge um certo número de ocorrências, e o painel de
moderação não notifica ninguém — um admin precisa entrar em
`/admin/moderacao` periodicamente para ver o que chegou.

## Sobre o tour de boas-vindas

`OnboardingTour.tsx` (montado globalmente em `layout.tsx`, junto com o
prompt de instalação do PWA e a bolha do tutor) mostra um modal de 6
passos na primeira visita — Trilhas/gamificação, ferramentas de
estudo (calculadora, foto, quadro), o tutor Gauss, os recursos
sociais (chat/comunidades/lives) e um passo final. "Pular" ou chegar
ao último passo grava `onboarding-tour-dismissed` no `localStorage` e
o tour nunca mais aparece nesse navegador — sem conta, sem backend,
mesmo padrão do prompt de instalação do PWA
(`InstallPwaPrompt.tsx`).

**Nota para quem for mexer nos testes e2e**: como cada teste do
Playwright começa com um contexto de navegador limpo (sem
`localStorage`), o tour apareceria na primeira visita de *todo* teste
e bloquearia cliques nos elementos por baixo do modal. Para não
precisar tocar em ~30 arquivos de spec existentes, `playwright.config.ts`
seta `use.storageState` para um arquivo (`e2e/onboarding-dismissed-storage-state.json`)
que já marca o tour como dispensado, globalmente, por padrão.
`e2e/onboarding.spec.ts` é o único arquivo que precisa ver o tour de
verdade — ele sobrescreve isso com
`test.use({ storageState: { cookies: [], origins: [] } })` para
simular um visitante realmente novo.

## Sobre exportação e exclusão de conta (LGPD)

A [página de privacidade](/privacidade) promete os direitos de acesso,
portabilidade e exclusão previstos na LGPD — `/conta` (link no e-mail
do usuário, no canto superior direito) é onde a pessoa exerce esses
direitos sozinha, sem precisar pedir para alguém da equipe:

- **Exportar meus dados**: `GET /api/account/export` devolve um JSON
  para download com tudo que o app guarda sobre a conta — perfil, XP,
  sequência, progresso por tópico, assinatura, status de verificação
  de identidade, turmas criadas/matriculadas, comunidades
  criadas/participadas, mensagens enviadas (chat e comunidade), lives
  hospedadas, contatos bloqueados e denúncias feitas. Cada consulta
  passa pelo client do próprio usuário (RLS), nunca pela
  `service_role` — só pode devolver o que a pessoa já teria acesso de
  qualquer forma.
- **Excluir minha conta**: exige digitar o próprio e-mail como
  confirmação antes de habilitar o botão (`DeleteAccountForm.tsx`).
  `deleteMyAccount` (em `src/app/actions/account.ts`) chama
  `supabase.auth.admin.deleteUser(user.id)` — como toda tabela no
  schema referencia `auth.users` com `on delete cascade`, apagar essa
  linha já apaga perfil, progresso, assinatura, mensagens, turmas e
  comunidades criadas, tudo em cascata, sem precisar apagar tabela por
  tabela manualmente. Ação irreversível.

**Limitações desta primeira versão**: a exportação não inclui as
contagens de uso diário (`photo_solve_usage`/`tutor_usage` — só
contadores de limite, não conteúdo pessoal em si) nem mensagens que a
pessoa *recebeu* de outros (só as que ela mesma enviou, já que
mensagens recebidas também são dado de quem enviou). **Cuidado ao
excluir a conta de quem criou uma turma, comunidade ou conversa**: como
`communities.creator_id`, `turmas.teacher_user_id` e
`conversations.created_by` também têm `on delete cascade` até
`auth.users`, excluir a conta do criador apaga a turma/comunidade/
conversa **inteira em cascata para todo mundo**, não só a participação
de quem foi excluído — os alunos perdem a turma, os outros membros
perdem a comunidade, o outro lado de uma conversa perde o histórico
todo. Um passo futuro seria transferir a titularidade para outro
membro (ou bloquear a autoexclusão enquanto a pessoa for a única
dona) antes de permitir a exclusão da conta.

## Sobre o painel de moderação

`/admin/moderacao` lista as denúncias feitas via "Denunciar" (chat e
comunidades), com o conteúdo da mensagem, quem enviou e quem denunciou
— só quem está na tabela `admins` consegue ver essa página (qualquer
outra pessoa recebe 404, não uma mensagem de "acesso negado", para não
revelar que a página existe). Para cada denúncia pendente, o admin
pode:

- **Dispensar**: marca a denúncia como resolvida sem tomar nenhuma
  ação (`resolve_report` com status `dismissed`).
- **Marcar ação tomada**: mesma coisa, mas registra que alguma ação
  foi tomada fora do painel (`action_taken`) — útil quando a ação já
  foi feita manualmente (ex: conversa direta com o usuário).
- **Banir remetente dos recursos sociais**: insere o autor da
  mensagem em `banned_users`. A partir daí, `getSocialAccessStatus()`
  retorna `"banned"` para essa pessoa, bloqueando chat, comunidades e
  lives — mas **não** afeta login nem o conteúdo educacional do resto
  do app. Reversível a qualquer momento ("Desbanir remetente").

**Promovendo um admin**: não existe (de propósito) nenhuma tela de
"virar admin" — isso teria que ser auto-serviço ou exigir um segundo
nível de permissão para conceder permissões, o que é mais complexidade
do que vale a pena agora. Em vez disso, promova alguém rodando, no SQL
Editor do Supabase (com a `service_role`, nunca pelo cliente):

```sql
insert into public.admins (user_id)
values ('UUID_DO_USUARIO_AQUI');
```

**Limitações desta primeira versão**: sem log de auditoria de ações do
painel (quem baniu quem, quando), sem busca/filtro na lista de
denúncias, e sem paginação (ok para o volume esperado agora).

## Sobre as turmas

Não existe uma tabela/flag de "papel" (professor vs. aluno) — qualquer
conta pode criar uma turma em `/turmas` e vira dona dela; nada impede a
mesma pessoa de também ser aluna em outra turma. Isso mantém o modelo
de dados simples e evita uma etapa de "solicitar acesso de professor".

O código de acesso (6 caracteres, sem `0/O/1/I` pra evitar confusão ao
digitar) é a única forma de entrar numa turma — não existe listagem
pública de turmas. Ver o progresso dos alunos (XP, sequência, resultado
de uma tarefa) exigiria que o professor lesse linhas de
`topic_progress`/`gamification_state` de outros usuários, o que a RLS
dessas tabelas bloqueia por padrão (cada usuário só lê a própria
linha). Em vez de afrouxar a RLS dessas tabelas — o que abriria uma
brecha maior do que o necessário — funções `security definer` em
`supabase/schema.sql` fazem exatamente essa checagem pontual
(confirmam que quem está chamando é o professor daquela turma
específica antes de retornar qualquer linha): `join_turma_by_code`,
`get_turma_roster`, `get_turma_assignment_progress` e
`get_turma_ai_usage`.

**Desempenho por atribuição**: a página da turma (para o professor)
mostra uma tabela aluno × tarefa — cada célula é a nota daquela tarefa
específica para aquele aluno (`X/Y (Z%)`, colorida verde/amarelo/
vermelho pela porcentagem), ou "Ainda não tentou" se o aluno ainda não
fez aquele exercício. Isso já usava a RPC `get_turma_assignment_progress`
(criada desde o início, mas nunca conectada a nenhuma tela) — o único
código novo foi chamá-la uma vez por tarefa (em paralelo, via
`Promise.all`) e montar a tabela em `TurmaPerformanceMatrix.tsx`. É
assim que um professor identifica rapidamente que um aluno específico
está com dificuldade num tópico específico, em vez de só ver XP/
sequência agregados.

**Uso de IA pelos alunos**: o professor também vê, por aluno, quantas
mensagens ele trocou com o tutor Gauss e quantos problemas resolveu por
foto/quadro (soma de todo o histórico, mais a data da última
atividade) — `get_turma_ai_usage` reaproveita os contadores diários que
já existiam para limitar cota (`tutor_usage`/`photo_solve_usage`), sem
precisar de tabela nova nem de mudar a cota em si. Importante: isso
expõe só *quantidade e data* de uso, nunca o *conteúdo* das conversas ou
das fotos — as tabelas de conteúdo completo (`gauss_conversations`/
`gauss_messages`/`photo_solve_history`, usadas em `/historico`)
continuam com RLS restrita ao próprio aluno; o professor não tem, e não
deveria ter, acesso a elas.

## Sobre a integração de conhecimento (o "neurônio")

A ideia: o conhecimento no app não devia viver isolado em "gavetas"
por trilha — uma ideia como "coeficiente angular" aparece na Geometria
Analítica do Ensino Médio, reaparece como β1 na Regressão Linear
Simples de Econometria, e é o próprio modelo que o Machine Learning
"Introdução" ensina a treinar. Esta primeira versão (v1) conecta esses
pontos de um jeito propositalmente simples — sem embeddings nem busca
vetorial de verdade —, servindo como prova de conceito para uma versão
2 mais sofisticada (ver "Fase 2" abaixo).

Como funciona hoje:

1. **Tópicos relacionados**: um campo opcional `relatedTopics` em
   `Topic` (`src/data/curriculum.ts`) referencia outros tópicos por
   `{ levelId, topicId }`. `getRelatedTopics(topic)` resolve essas
   referências para os tópicos de verdade (ignorando qualquer id
   digitado errado). Curada à mão, hoje conectando tópicos que
   atravessam trilhas diferentes — ex: "Função do 1º Grau" ↔ "Geometria
   Analítica" ↔ "Regressão Linear Simples" (Econometria) ↔
   "Fundamentos de Aprendizado Supervisionado" (Machine Learning),
   "Progressões" ↔ "Juros Simples"/"Juros Compostos" (Matemática
   Financeira, PA e PG na prática), "Probabilidade Básica" ↔ "Operações
   com Conjuntos" (Lógica e Conjuntos), "Distribuição Binomial" ↔
   "Distribuição Normal", "Testes de Hipótese" ↔ "Significância dos
   Coeficientes" (Econometria), e "Função Quadrática" ↔ "Limites e
   Derivadas" (Ensino Superior) — a mesma curva que vira parábola no
   Médio reaparece como objeto de derivada no Cálculo.
2. **Perguntar ao Gauss sobre isso**: um botão que abre o tutor de IA
   global (a bolha do Gauss) já com uma pergunta pré-preenchida
   mencionando o tópico atual. Como o tutor é um componente separado
   montado uma vez no layout raiz, a comunicação é feita com um evento
   customizado do navegador (`window.dispatchEvent`/`addEventListener`,
   ver `src/lib/gaussPrompt.ts`) — sem precisar de um Context ou
   estado global só para isso.
3. **Conversas relacionadas**: quando o usuário tem acesso social
   liberado (`granted`), a página do tópico busca (com `ilike` no
   título do tópico) mensagens de comunidades e conversas de chat das
   quais ele já participa — respeitando a RLS normalmente, então só
   aparecem resultados de comunidades/conversas que o usuário já é
   membro.

Tudo isso é renderizado por `KnowledgeGraph.tsx`, incluído no fim de
`/trilha/[nivel]/[topico]`. Quando um tópico não tem `relatedTopics`,
só o botão do Gauss aparece — o resto da seção fica invisível.

4. **Caminho de conhecimento (`/caminho/[nivel]/[topico]`)**: o rodapé
   de tópicos relacionados é uma lista plana — bom para "aqui está algo
   parecido", mas não mostra a ideia de espiral entre trilhas. A página
   `/caminho` resolve isso: mostra o tópico atual no centro, seus
   tópicos relacionados diretos (1º grau) cada um com dois botões
   ("Estudar este tópico" → a lição de verdade; "Explorar conexões" →
   continua a navegação pelo caminho daquele tópico), e — o que faz
   isso parecer de fato um caminho, não só uma lista — os tópicos
   relacionados de CADA um desses (2º grau), como chips menores. É
   assim que "Geometria Analítica" (Ensino Médio) mostra "Regressão
   Linear Simples" (Econometria) que por sua vez mostra "Fundamentos de
   Aprendizado Supervisionado" (Machine Learning) sem precisar clicar
   duas vezes. Lógica pura e testável em
   `src/lib/knowledgePathway.ts` (a função `buildPathway` cuida de não
   repetir o tópico central nem duplicar um tópico de 2º grau que
   aparece nas conexões de mais de um tópico de 1º grau). Um link "Ver
   caminho de conhecimento completo →" na página real do tópico é a
   porta de entrada; tópicos sem `relatedTopics` mostram um estado
   vazio em vez de 404.

**Fase 2 (implementada, opcional)**: a curadoria manual de
`relatedTopics` não escala para milhares de exercícios, então também
existe um caminho por embeddings — opcional, precisa de
`VOYAGE_API_KEY` configurada. `npm run generate-embeddings`
(`scripts/generate-topic-embeddings.ts`) gera um embedding do
título+resumo+teoria de cada tópico via a [Voyage
AI](https://www.voyageai.com/) (modelo `voyage-4`, 1024 dimensões;
exercícios ficam de fora do texto embeddado de propósito, para não
diluir o embedding com variações repetitivas de uma mesma ideia) e
grava numa tabela `topic_embeddings` (extensão
[pgvector](https://github.com/pgvector/pgvector) do Postgres),
pulando tópicos cujo conteúdo não mudou (comparando um hash). A RPC
`match_related_topics` busca os tópicos mais parecidos por
similaridade de cosseno (`<=>` no pgvector). `KnowledgeGraph.tsx`
mescla esses resultados semânticos com os `relatedTopics` curados à
mão (sem duplicar), então mesmo sem rodar o script nada quebra — o
grafo só usa a curadoria manual, exatamente como antes. A busca de
discussões no chat/comunidades continua usando `ilike` por enquanto
(buscar por embedding ali também é possível, mas não foi feito nesta
versão). Como não temos uma conta real da Voyage AI configurada neste
ambiente de desenvolvimento, esse caminho não foi testado contra o
serviço de verdade.

## Sobre os comandos de voz

Usa a [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) do próprio navegador (`SpeechRecognition`/
`webkitSpeechRecognition`) — sem chave de API, sem custo, sem servidor
envolvido. Funciona no Chrome/Edge e no Safari; **não funciona no
Firefox**, que ainda não implementa essa API — nesse caso o botão de
voz simplesmente não aparece (detecção de suporte em
`src/lib/useSpeechRecognition.ts`), sem quebrar nada.

Dois lugares usam voz hoje:

1. **Responder exercícios** (`ExerciseQuiz.tsx`): um botão "🎤 Falar
   resposta" aparece acima das alternativas (múltipla escolha) ou ao
   lado do campo de resposta (numérico). Para múltipla escolha, o
   texto reconhecido é comparado com as opções (`matchSpokenOption`
   em `src/lib/voiceMatching.ts` — primeiro tenta igualdade exata,
   depois substring, depois a opção com mais palavras em comum) e a
   mais parecida é selecionada automaticamente. Para resposta
   numérica, `extractSpokenNumber` tenta achar um número (ou fração
   tipo "2/3", testado antes do padrão decimal simples para não
   truncar a fração) na fala, e cai no texto bruto se não achar
   nenhum.
2. **Perguntar ao Gauss por voz**: o mesmo botão de voz aparece ao
   lado do campo de mensagem do tutor de IA, adicionando a fala
   reconhecida ao texto já digitado (não substitui, então dá pra
   compor uma pergunta por voz e texto juntos).

O reconhecimento usa o idioma da interface (`src/i18n/`) para
configurar `recognition.lang` (ex: `pt-BR`, `en-US`, `es-ES`) — exceto
nos exercícios, que são conteúdo só em português e por isso sempre
usam `pt-BR`, independente do idioma da interface.

Como testar sem microfone: a API real não roda em Chromium headless
(sem permissão de microfone), então os testes (`e2e/voice-input.spec.ts`)
injetam uma classe `SpeechRecognition` de mentira via
`page.addInitScript` antes da página carregar — `start()` dispara
`onresult` com uma transcrição fixa, exercitando o fluxo completo
"clicar no microfone → preencher resposta → corrigir" de ponta a
ponta, sem precisar de áudio de verdade.

**Limitações desta primeira versão**: sem suporte a comandos de voz
para navegação (ex: "próxima pergunta", "abrir turma") — só
preenchimento de resposta/pergunta. A correspondência de opções de
múltipla escolha funciona bem para alternativas com palavras (ex:
"Verdadeiro"/"Falso"), mas é menos confiável quando as opções são só
notação numérica (ex: frações como "6/10") — falar "seis décimos" não
bate com "6/10" através de correspondência de texto simples.

## Sobre a revisão espaçada

A página `/revisao` (`src/components/ReviewSession.tsx`) traz de volta,
depois de um tempo, exercícios específicos que o aluno errou em
qualquer trilha — repetição espaçada no estilo SM-2, mas simplificada
(`src/lib/reviewSchedule.ts`):

- Toda vez que `ExerciseQuiz.tsx` verifica uma resposta, ele chama
  `recordReviewResult(levelId, topicId, difficulty, exerciseId,
  correto)`, que agenda a próxima revisão daquele exercício específico
  (não do tópico inteiro): acerto dobra o intervalo desde a última vez
  (começando em 1 dia, com teto de 60 dias); erro volta o intervalo pra
  1 dia.
- O estado fica no `localStorage` (`meridiano-math-review-schedule`),
  local-first como progresso e gamificação, e sincroniza com a nuvem do
  mesmo jeito (tabela `review_schedule`, RLS dono-só, wireup em
  `src/lib/cloudSync.ts`) quando o usuário está logado com Supabase
  configurado.
- Ao abrir `/revisao`, a lista de exercícios vencidos (`dueAt` no
  passado) é capturada uma única vez no início da sessão
  (`buildDueItems()`) — revisar um exercício não o remove da lista
  atual, mesmo que ele já não esteja mais "vencido" no armazenamento;
  isso evita que a lista mude de tamanho no meio da sessão.
- Quando não há nada vencido, a página mostra um estado vazio
  convidando a praticar mais trilhas — é assim que a maioria dos
  acessos deve começar, já que o intervalo mínimo é de 1 dia.

**Limitação desta primeira versão**: como a lista de "vencidos" só é
recalculada ao carregar a página (não em tempo real), um exercício que
passa a vencer enquanto a aba já está aberta só aparece na próxima
visita a `/revisao`.

## Sobre a dificuldade adaptativa

O seletor de dificuldade (`DifficultyPicker.tsx`) destaca com um selo
"Recomendado" o nível mais indicado pra praticar em seguida, sem tirar
a escolha manual do usuário — os quatro níveis continuam clicáveis
como sempre.

A recomendação (`src/lib/adaptiveDifficulty.ts`, função pura e
testada) usa a mesma régua de 70% de acerto do resultado do quiz
("Muito bem!" vs. "Bom começo"): percorre Fácil → Médio → Difícil →
Olimpíada e recomenda o primeiro nível que o aluno ainda não tentou, ou
tentou e ficou abaixo de 70% — nesse caso, o selo fica no nível atual
em vez de empurrar pra frente, sugerindo reforçar antes de avançar. Se
todos os quatro níveis já foram dominados, a recomendação fica em
Olimpíada, o mais difícil.

Como o `DifficultyPicker` faz parte do motor de exercícios (junto com
o `ExerciseQuiz`), o selo "Recomendado" fica hardcoded em português,
pela mesma razão dos outros textos dessa seção — ver "O que ainda não
é traduzido" abaixo, em "Sobre o idioma". Para não quebrar seletores de
teste como `getByRole("button", { name: /^Fácil/ })`, o card
recomendado recebe um `aria-label` explícito ("Fácil (recomendado)") em
vez de deixar o texto do selo entrar na ordem natural do nome
acessível do botão.

## Sobre o idioma

O seletor de idioma (`src/i18n/`) traduz toda a navegação e as páginas
de nível superior: menu, home, login/cadastro, resolver por foto e
quadro de rascunho, em 15 idiomas — Português, English, Español, 中文
(chinês), Italiano, 한국어 (coreano), Deutsch, Français, 日本語
(japonês), العربية (árabe), Русский (russo), हिन्दी (hindi), Tiếng Việt
(vietnamita), Polski (polonês) e Türkçe (turco). A arquitetura é simples
de propósito — dicionários (`src/i18n/dictionaries.ts`) mais um cookie
(lido por Server e Client Components), sem reescrever rotas com
prefixo de idioma (`/en/...`). Adicionar um novo idioma é só: (1)
adicionar o código à união `Locale` e ao array `LOCALES` em
`src/i18n/config.ts` (mais `RTL_LOCALES` se for um idioma da direita
pra esquerda), e (2) adicionar um objeto completo ao `dictionaries` em
`dictionaries.ts` — o TypeScript aponta na hora qualquer chave faltando,
porque `Record<Locale, Dictionary>` exige as ~330 chaves do tipo
`Dictionary` para todo idioma.

**O que ainda não é traduzido** (fica em português por enquanto):

- O conteúdo do currículo em si (teoria e enunciados de exercícios em
  `src/data/curriculum.ts`) — traduzir isso com qualidade pedagógica é
  um projeto de conteúdo à parte, do mesmo porte de adicionar um nível
  novo, não algo que dá para fazer bem em lote.
- O motor de exercícios (`ExerciseQuiz`, `DifficultyPicker`) e a
  página de revisão espaçada (`ReviewSession`, que reaproveita o mesmo
  motor) — mexer neles quebraria dezenas de testes e2e que hoje
  verificam texto exato em português; fica como próximo passo se
  decidirmos ir além da navegação. O link do menu (`nav.revisao`) já
  está traduzido nos 15 idiomas, como qualquer outro item de navegação.
  O dashboard de progresso (`/progresso`, incluindo o card "Pontos de
  atenção" e a grade de conquistas) já é totalmente traduzido — chaves
  `progresso` e `badges` em `dictionaries.ts` (`badges` é indexada por
  `BadgeId`, o mesmo `id` usado em `BADGES` no `gamification.ts`),
  com tradução real nos 15 idiomas (identity, chat, comunidades, lives
  e onboarding também já têm tradução real nos 15 — não há mais
  nenhuma seção com fallback pro inglês). A única exceção é o toast
  "Nova conquista!" que aparece dentro do
  `ExerciseQuiz` ao terminar um quiz — ele ainda usa `badge.name`/
  `badge.description` direto do `gamification.ts` (português), de
  propósito: o resto da tela de resultado do `ExerciseQuiz` também é
  só português (ver item acima), então traduzir só o nome da conquista
  ali deixaria a tela com dois idiomas misturados — pior que deixar
  tudo em português.
- Mensagens de erro de autenticação (vêm prontas do Supabase via
  `src/app/actions/auth.ts`).

Isso significa: hoje dá para navegar o app inteiro em qualquer um dos
14 outros idiomas, mas ao entrar numa trilha e resolver exercícios, o
conteúdo continua em português.

**Sobre as seções sociais mais novas** (`identity`, `chat`,
`communities`, `lives`, `knowledgeGraph`, `onboarding`): pt-BR e es têm
tradução real desde que essas seções foram criadas; os outros 8 idiomas
apontam para `socialFeaturesEn` (um bloco de textos em inglês
compartilhado) em vez de repetir o inglês em cada objeto de idioma —
assim o `Dictionary` fica satisfeito sem duplicar string por string.
Traduzir de verdade as 6 seções para os 8 idiomas de uma vez é um
projeto grande; em vez de tentar tudo junto, aprofundamos uma seção por
vez conforme dá tempo — `chat` já tem tradução real em Français (`fr`)
como primeiro passo, e o resto do inglês compartilhado continua
funcionando normalmente enquanto isso avança aos poucos.

## Auditoria do stack social (chat, comunidades, lives) — recomendação

Este é um registro escrito, não uma decisão tomada nem uma remoção de
código. O pedido original era "auditar" o stack social (chat 1:1/grupo,
comunidades, lives) e sinalizar se vale a pena manter/expandir — mas uma
auditoria de verdade precisa de dados de uso reais, e até este momento
(a analytics de produto, ver seção acima e
[README](../README.md#estado-atual), acabou de ser criada) não existe
histórico algum para analisar. O que segue é o raciocínio qualitativo
disponível hoje, mais o plano concreto para transformar isso numa
decisão baseada em dados assim que houver uso real para medir.

### O que esse stack custa hoje

- **Complexidade de código**: `chat`/`communities`/`lives` somam várias
  tabelas (`dm_messages`, `group_conversations`, `communities`,
  `community_members`, `live_sessions`, `message_reports`,
  `blocked_users`), várias RPCs `security definer`, canais Realtime do
  Supabase, e o fluxo de verificação de identidade + consentimento dos
  responsáveis (Stripe Identity) que existe **por causa** desse stack —
  nada mais no app exige verificar identidade. É a parte mais grande e
  mais sensível da base de código (ver
  [docs/setup.md](./setup.md#configurando-verificação-de-identidade-e-consentimento-dos-responsáveis)).
- **Custo externo real**: lives usam LiveKit Cloud, que cobra por
  minuto de uso — é o único recurso do app com custo variável ligado
  diretamente a quanto as pessoas o usam (diferente de Supabase/Stripe,
  que têm planos mais previsíveis nesta escala).
- **Superfície de risco/moderação**: qualquer produto com chat entre
  usuários (ainda mais com possíveis menores de idade, daí o
  consentimento parental) carrega risco de abuso/conteúdo impróprio.
  Isso já foi endereçado com um painel de moderação real (denúncias,
  bloqueio, remoção — ver "Sobre a moderação" acima), mas esse painel
  também é trabalho de manutenção contínuo, não um custo que se paga
  uma vez.
- **Manutenção de testes**: `e2e/chat`-adjacentes, `moderation*.spec.ts`
  etc. rodam a cada push, com o custo de tempo de CI que isso implica.

### O que esse stack pode valer

- É o recurso que mais diferencia o app de Brilliant/Khan/Photomath —
  nenhum concorrente direto tem comunidade + chat + aulas ao vivo
  dentro do próprio app de matemática. Se for usado, é um fosso
  competitivo real (rede social de estudo, não só conteúdo).
  Duolingo tem algo parecido (clubes/ligas) e é justamente a parte do
  produto deles associada a maior retenção de longo prazo.
- Mesmo sem uso pesado, comunidades/turmas dão um motivo pra abrir o
  app fora do momento de "preciso estudar agora" (hábito, notificação
  social), que é diferente do gancho de "tenho uma prova".

### O problema: ainda não sabemos qual dos dois é verdade

Nenhum desses dois lados tem números por trás hoje. `analytics_events`
(painel em `/admin/analytics`) só rastreia 4 eventos de funil de estudo
(`signup`, `exercicio_concluido`, `gauss_mensagem`, `foto_resolvida`) —
nenhum deles mede uso do chat, comunidades ou lives.

### Recomendação concreta

1. **Curto prazo (próxima rodada de trabalho, não incluída aqui por
   escopo)**: instrumentar 3 eventos análogos aos que já existem —
   primeira mensagem de chat enviada, primeira comunidade
   criada/entrada, primeira live assistida — reaproveitando
   `trackFirstTimeEvent()` de `src/lib/analytics/trackEvent.ts` nos
   mesmos pontos onde `ChatThread.tsx`/`src/app/actions/communities.ts`/
   `LiveRoom.tsx` já fazem a ação real. Isso é aditivo (não remove nada)
   e é o que faltava pra fechar o ciclo desta auditoria.
2. **Depois de ~4-6 semanas de dados reais** em `/admin/analytics`,
   revisitar esta decisão com números: se `chat_mensagem`/
   `comunidade_entrou`/`live_assistida` ficarem consistentemente perto
   de zero enquanto os eventos de estudo (`exercicio_concluido`,
   `gauss_mensagem`) crescem normalmente, isso é sinal de que o stack
   social não está sendo descoberto/usado — e aí vale considerar
   simplificar (por exemplo, lives primeiro, por ser o item de maior
   custo externo e menor uso esperado numa base pequena) antes de
   comunidades, e chat por último, já que é o mais barato de manter e o
   que menos depende de "massa crítica" de usuários pra funcionar (só
   precisa de duas pessoas).
3. Se os números mostrarem uso real, a recomendação se inverte: vale
   investir mais (gravação/replay de lives, chat de texto durante a
   transmissão, notificações melhores de atividade em comunidades) em
   vez de cortar.

Nenhuma dessas ações (instrumentar, ou eventualmente simplificar) foi
executada como parte deste item — é uma decisão do time, com dados,
quando houver dados.

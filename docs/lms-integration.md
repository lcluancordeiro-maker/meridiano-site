# Integração com LMS (Google Classroom / Clever) para turmas

Este documento descreve o que está implementado hoje (importação via CSV)
e o caminho real de integração via OAuth que ainda não existe neste
ambiente — nenhum dos dois provedores tem um app OAuth registrado aqui, e
registrar um exige um processo de verificação manual pelo Google/Clever
que leva dias ou semanas e precisa de um domínio/organização reais, coisa
que não existe num sandbox.

## O que já funciona: importação por CSV

Tanto o Google Classroom quanto o Clever permitem exportar a lista de
alunos de uma turma como CSV nativamente (sem precisar de API/OAuth) —
Classroom via "Alunos → exportar", Clever via o painel do distrito. O
professor exporta esse arquivo e envia direto na página da turma
(`/turmas/[turmaId]`, seção "Importar do Google Classroom / Clever").

- `src/lib/lmsRoster.ts` (`parseRosterEmails`, testado isoladamente) —
  extrai e-mails de qualquer formato de exportação (CSV completo com
  colunas de nome/ID que a gente ignora, ou uma lista simples de um
  e-mail por linha), ignorando a linha de cabeçalho.
- `add_turma_member_by_email(p_turma_id, p_email)`
  (`supabase/schema.sql`) — função `security definer` que só o professor
  dono da turma pode chamar; matricula direto quem já tem conta no app
  pelo e-mail (complementa `join_turma_by_code`, que é iniciado pelo
  aluno com o código da turma). Quem ainda não tem conta continua
  podendo entrar sozinho pelo código, normalmente.
- `importTurmaRoster()` (`src/app/actions/turmas.ts`) — server action que
  lê o arquivo, chama a função acima pra cada e-mail e devolve um resumo
  (quantos adicionados / já eram membros / sem conta ainda / linhas
  ignoradas).

## O caminho real: OAuth + API

Para sincronizar automaticamente (sem o professor precisar exportar/
importar manualmente toda vez que a turma muda), o próximo passo seria:

### Google Classroom

1. Criar um projeto no [Google Cloud Console](https://console.cloud.google.com),
   ativar a **Google Classroom API** e configurar a tela de consentimento
   OAuth — Google exige verificação manual do app pra escopos sensíveis
   como `classroom.rosters.readonly`, o que não é algo que se completa
   num ambiente de desenvolvimento isolado.
2. Variáveis de ambiente novas: `GOOGLE_CLASSROOM_CLIENT_ID` e
   `GOOGLE_CLASSROOM_CLIENT_SECRET` (separadas das já existentes
   `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` do login social, que usam
   escopos bem mais simples e não passam por essa verificação).
3. Um fluxo OAuth próprio (parecido com `signInWithGoogle` em
   `src/app/actions/auth.ts`, mas pedindo o escopo
   `https://www.googleapis.com/auth/classroom.rosters.readonly` em vez
   do escopo básico de login) — o professor autoriza uma vez por turma
   vinculada.
4. Guardar o `refresh_token` retornado (criptografado) numa tabela nova,
   ex. `turma_lms_links (turma_id, provider, external_course_id,
   refresh_token, last_synced_at)`.
5. Uma rota/cron que chama `courses.students.list` da Classroom API
   periodicamente (ou sob demanda, com um botão "Sincronizar agora" na
   página da turma) e faz a mesma matrícula que
   `add_turma_member_by_email` já faz hoje — o roster CSV de hoje vira
   só o "modo manual" de um sistema que passaria a ter também um "modo
   automático".

### Clever

Segue o mesmo formato: um app registrado no
[Clever Developer Dashboard](https://dev.clever.com), escopo
`read:sections` (ou `read:section_students`), OAuth por distrito escolar
(não por professor individual — Clever é organizado em torno do
distrito, então normalmente é a secretaria de educação que aprova a
integração, não cada professor sozinho), e depois `GET
/v3.0/sections/{id}/students` na [Clever API](https://dev.clever.com/docs)
pra puxar o roster.

## Por que não simular isso agora

Sem credenciais reais registradas em nenhum dos dois provedores, qualquer
código de troca de token/chamada de API aqui seria decorativo — não
haveria como testar de ponta a ponta, e um roteiro de integração "fake"
correria o risco de parecer funcional sem nunca ter sido validado contra
a API real. A importação por CSV, em contrapartida, é uma funcionalidade
completa e testável hoje: não depende de nenhuma credencial externa e
resolve o mesmo problema prático (trazer o roster de uma turma existente
pro app) com uma fricção pequena (um export/import manual) em vez de
nenhuma.

-- Meridiano Matemática — schema inicial (contas + sincronização de progresso).
--
-- Como aplicar: no painel do Supabase, vá em "SQL Editor" → "New query",
-- cole este arquivo inteiro e clique em "Run". Seguro de rodar mais de uma
-- vez (usa "if not exists" / "or replace" onde possível).

-- ---------------------------------------------------------------------
-- profiles: uma linha por usuário, criada automaticamente no cadastro.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Cria o profile automaticamente quando um usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- topic_progress: espelha src/lib/progress.ts (uma linha por
-- usuário/nível/tópico/dificuldade).
-- ---------------------------------------------------------------------
create table if not exists public.topic_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  level_id text not null,
  topic_id text not null,
  difficulty text not null,
  score integer not null,
  total integer not null,
  completed boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id, topic_id, difficulty)
);

alter table public.topic_progress enable row level security;

drop policy if exists "topic_progress_own" on public.topic_progress;
create policy "topic_progress_own"
  on public.topic_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- review_schedule: espelha src/lib/reviewSchedule.ts (uma linha por
-- usuário/nível/tópico/exercício). Guarda a repetição espaçada — quando
-- um exercício específico deve ser revisado de novo, com um algoritmo
-- estilo SM-2 simplificado (o intervalo dobra a cada acerto, volta a 1
-- dia a cada erro).
-- ---------------------------------------------------------------------
create table if not exists public.review_schedule (
  user_id uuid not null references auth.users (id) on delete cascade,
  level_id text not null,
  topic_id text not null,
  exercise_id text not null,
  difficulty text not null,
  interval_days integer not null default 1,
  due_at timestamptz not null default now(),
  last_result text not null check (last_result in ('correct', 'incorrect')),
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id, topic_id, exercise_id)
);

alter table public.review_schedule enable row level security;

drop policy if exists "review_schedule_own" on public.review_schedule;
create policy "review_schedule_own"
  on public.review_schedule for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- gamification_state: espelha src/lib/gamification.ts (uma linha por
-- usuário).
-- ---------------------------------------------------------------------
create table if not exists public.gamification_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  streak_current integer not null default 0,
  streak_longest integer not null default 0,
  streak_last_active_date date,
  unlocked_badges jsonb not null default '[]'::jsonb,
  completed_topics jsonb not null default '[]'::jsonb,
  xp_log jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.gamification_state enable row level security;

drop policy if exists "gamification_state_own" on public.gamification_state;
create policy "gamification_state_own"
  on public.gamification_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- photo_solve_usage: limite diário da funcionalidade "resolver por foto"
-- (cada chamada tem custo real de API, então cada usuário tem uma cota).
-- ---------------------------------------------------------------------
create table if not exists public.photo_solve_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.photo_solve_usage enable row level security;

drop policy if exists "photo_solve_usage_select_own" on public.photo_solve_usage;
create policy "photo_solve_usage_select_own"
  on public.photo_solve_usage for select
  using (auth.uid() = user_id);

-- Incrementa a contagem de hoje de forma atômica e recusa (exceção) quando
-- o limite diário é ultrapassado. "security definer" porque o incremento em
-- si não passa pela policy de select acima (não há policy de insert/update
-- para o usuário comum) — a função é o único caminho de escrita.
create or replace function public.increment_photo_usage(p_limit integer)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  new_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.photo_solve_usage (user_id, usage_date, count)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, usage_date)
  do update set count = public.photo_solve_usage.count + 1
  returning count into new_count;

  if new_count > p_limit then
    raise exception 'daily_limit_exceeded';
  end if;

  return new_count;
end;
$$;

grant execute on function public.increment_photo_usage(integer) to authenticated;

-- ---------------------------------------------------------------------
-- subscriptions: status da assinatura Premium (Stripe) por usuário.
-- Só a service_role (usada pelo webhook do Stripe, nunca pelo navegador)
-- grava nesta tabela — o usuário comum só pode ler a própria linha, por
-- isso não há policy de insert/update/delete para "authenticated".
-- ---------------------------------------------------------------------
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'none',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- turmas: ferramenta para professores. Qualquer usuário pode criar uma
-- turma (vira professor dela) e continua podendo praticar normalmente
-- como aluno em paralelo — não há um "papel" separado de professor.
--
-- As três tabelas são criadas primeiro (sem policies) porque as policies
-- de cada uma fazem referência cruzada às outras duas.
-- ---------------------------------------------------------------------
create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  join_code text not null unique,
  created_at timestamptz not null default now()
);

-- turma_members: matrícula de alunos numa turma. Só é gravada através da
-- função join_turma_by_code abaixo — não há policy de insert direta pra
-- aluno comum, então um aluno nunca consegue se matricular sem o código.
create table if not exists public.turma_members (
  turma_id uuid not null references public.turmas (id) on delete cascade,
  student_user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (turma_id, student_user_id)
);

-- turma_assignments: tópicos/dificuldades que o professor atribui à
-- turma. Não referencia uma tabela de currículo (o currículo vive em
-- src/data/curriculum.ts, não no banco) — level_id/topic_id/difficulty
-- são só os mesmos ids de string usados lá.
create table if not exists public.turma_assignments (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  level_id text not null,
  topic_id text not null,
  difficulty text not null,
  created_at timestamptz not null default now()
);

-- teacher_user_id/student_user_id (2ª coluna da PK de turma_members, não
-- coberta pelo índice da PK) e turma_id em turma_assignments são todos
-- filtrados por RLS/consultas de listagem — sem índice, cada select vira
-- um full scan à medida que a tabela cresce.
create index if not exists turmas_teacher_user_id_idx on public.turmas (teacher_user_id);
create index if not exists turma_members_student_user_id_idx on public.turma_members (student_user_id);
create index if not exists turma_assignments_turma_id_idx on public.turma_assignments (turma_id);

alter table public.turmas enable row level security;
alter table public.turma_members enable row level security;
alter table public.turma_assignments enable row level security;

-- O professor vê as próprias turmas; um aluno só vê turmas em que já é
-- membro (nunca a lista inteira de turmas de outros professores).
drop policy if exists "turmas_select" on public.turmas;
create policy "turmas_select"
  on public.turmas for select
  using (
    auth.uid() = teacher_user_id
    or exists (
      select 1 from public.turma_members tm
      where tm.turma_id = turmas.id and tm.student_user_id = auth.uid()
    )
  );

drop policy if exists "turmas_insert" on public.turmas;
create policy "turmas_insert"
  on public.turmas for insert
  with check (auth.uid() = teacher_user_id);

drop policy if exists "turmas_delete" on public.turmas;
create policy "turmas_delete"
  on public.turmas for delete
  using (auth.uid() = teacher_user_id);

drop policy if exists "turma_members_select" on public.turma_members;
create policy "turma_members_select"
  on public.turma_members for select
  using (
    auth.uid() = student_user_id
    or exists (
      select 1 from public.turmas t
      where t.id = turma_members.turma_id and t.teacher_user_id = auth.uid()
    )
  );

drop policy if exists "turma_assignments_select" on public.turma_assignments;
create policy "turma_assignments_select"
  on public.turma_assignments for select
  using (
    exists (
      select 1 from public.turmas t
      where t.id = turma_assignments.turma_id
        and (
          t.teacher_user_id = auth.uid()
          or exists (
            select 1 from public.turma_members tm
            where tm.turma_id = t.id and tm.student_user_id = auth.uid()
          )
        )
    )
  );

drop policy if exists "turma_assignments_insert" on public.turma_assignments;
create policy "turma_assignments_insert"
  on public.turma_assignments for insert
  with check (
    exists (
      select 1 from public.turmas t
      where t.id = turma_assignments.turma_id and t.teacher_user_id = auth.uid()
    )
  );

drop policy if exists "turma_assignments_delete" on public.turma_assignments;
create policy "turma_assignments_delete"
  on public.turma_assignments for delete
  using (
    exists (
      select 1 from public.turmas t
      where t.id = turma_assignments.turma_id and t.teacher_user_id = auth.uid()
    )
  );

-- Matricula o usuário atual na turma dona do código informado. "security
-- definer" porque não existe (de propósito) uma policy de select em
-- turmas por join_code — só assim dá pra achar a turma sem antes já ser
-- membro dela.
create or replace function public.join_turma_by_code(p_join_code text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_turma_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select id into v_turma_id from public.turmas where join_code = p_join_code;

  if v_turma_id is null then
    raise exception 'turma_not_found';
  end if;

  insert into public.turma_members (turma_id, student_user_id)
  values (v_turma_id, auth.uid())
  on conflict (turma_id, student_user_id) do nothing;

  return v_turma_id;
end;
$$;

grant execute on function public.join_turma_by_code(text) to authenticated;

-- Lista de alunos de uma turma com XP e streak, só pro professor dono
-- dela — junta dados de profiles/gamification_state que o professor não
-- teria como ler diretamente (RLS dessas tabelas é "só a própria linha").
create or replace function public.get_turma_roster(p_turma_id uuid)
returns table (
  student_user_id uuid,
  display_name text,
  xp integer,
  streak_current integer,
  joined_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.turmas where id = p_turma_id and teacher_user_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  return query
    select tm.student_user_id, pr.display_name, coalesce(gs.xp, 0), coalesce(gs.streak_current, 0), tm.joined_at
    from public.turma_members tm
    left join public.profiles pr on pr.id = tm.student_user_id
    left join public.gamification_state gs on gs.user_id = tm.student_user_id
    where tm.turma_id = p_turma_id
    order by tm.joined_at asc;
end;
$$;

grant execute on function public.get_turma_roster(uuid) to authenticated;

-- Progresso dos alunos numa tarefa específica (nível/tópico/dificuldade),
-- só pro professor dono da turma.
create or replace function public.get_turma_assignment_progress(
  p_turma_id uuid,
  p_level_id text,
  p_topic_id text,
  p_difficulty text
)
returns table (
  student_user_id uuid,
  display_name text,
  score integer,
  total integer,
  completed boolean
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.turmas where id = p_turma_id and teacher_user_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  return query
    select tm.student_user_id, pr.display_name, tp.score, tp.total, tp.completed
    from public.turma_members tm
    left join public.profiles pr on pr.id = tm.student_user_id
    left join public.topic_progress tp
      on tp.user_id = tm.student_user_id
      and tp.level_id = p_level_id
      and tp.topic_id = p_topic_id
      and tp.difficulty = p_difficulty
    where tm.turma_id = p_turma_id
    order by tm.joined_at asc;
end;
$$;

grant execute on function public.get_turma_assignment_progress(uuid, text, text, text) to authenticated;

-- ---------------------------------------------------------------------
-- push_subscriptions: endpoints de Web Push por usuário, usados para
-- lembretes de sequência (streak). Um usuário pode ter várias (um por
-- dispositivo/navegador em que ativou notificações).
-- ---------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_own" on public.push_subscriptions;
create policy "push_subscriptions_own"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sem policy de select/delete para outros usuários: só o service role
-- (usado pela rota /api/push/send-streak-reminders, nunca exposto ao
-- navegador) lê todas as inscrições para enviar os lembretes.

-- ---------------------------------------------------------------------
-- tutor_usage: limite diário de mensagens para o tutor de IA (Gauss).
-- Mesmo padrão de photo_solve_usage (cada mensagem tem custo real de API).
-- ---------------------------------------------------------------------
create table if not exists public.tutor_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.tutor_usage enable row level security;

drop policy if exists "tutor_usage_select_own" on public.tutor_usage;
create policy "tutor_usage_select_own"
  on public.tutor_usage for select
  using (auth.uid() = user_id);

create or replace function public.increment_tutor_usage(p_limit integer)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  new_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.tutor_usage (user_id, usage_date, count)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, usage_date)
  do update set count = public.tutor_usage.count + 1
  returning count into new_count;

  if new_count > p_limit then
    raise exception 'daily_limit_exceeded';
  end if;

  return new_count;
end;
$$;

grant execute on function public.increment_tutor_usage(integer) to authenticated;

-- ---------------------------------------------------------------------
-- identity_verifications: status da verificação de identidade (Stripe
-- Identity) por usuário — exigida antes de liberar chat/comunidades/lives
-- (recursos sociais), tanto para segurança quanto para saber se o usuário
-- é menor de idade (e, nesse caso, exigir consentimento dos responsáveis
-- antes de liberar os mesmos recursos — ver parent_consents abaixo).
--
-- Só a service_role grava esta tabela (tanto o "pending" inicial, criado
-- por /api/identity/create-session, quanto o status final gravado pelo
-- webhook) — mesmo padrão de "subscriptions": o usuário nunca consegue
-- se autodeclarar verificado, só ler a própria linha.
-- ---------------------------------------------------------------------
create table if not exists public.identity_verifications (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_verification_session_id text,
  status text not null default 'pending',
  date_of_birth date,
  verified_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.identity_verifications enable row level security;

drop policy if exists "identity_verifications_select_own" on public.identity_verifications;
create policy "identity_verifications_select_own"
  on public.identity_verifications for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- parent_consents: consentimento de um responsável legal para um usuário
-- verificado como menor de idade liberar recursos sociais (chat,
-- comunidades, lives) — estilo "verifiable parental consent" (COPPA).
--
-- Criada pelo webhook do Stripe Identity (service_role) quando a data de
-- nascimento verificada indica menor de idade. A confirmação em si
-- acontece por um link enviado ao e-mail do responsável, sem exigir que
-- ele tenha conta no app — por isso confirm_parental_consent abaixo é
-- "security definer" e não exige auth.uid().
-- ---------------------------------------------------------------------
create table if not exists public.parent_consents (
  user_id uuid primary key references auth.users (id) on delete cascade,
  parent_email text not null,
  token text not null unique,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.parent_consents enable row level security;

drop policy if exists "parent_consents_select_own" on public.parent_consents;
create policy "parent_consents_select_own"
  on public.parent_consents for select
  using (auth.uid() = user_id);

create or replace function public.confirm_parental_consent(p_token text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_updated integer;
begin
  update public.parent_consents
  set confirmed_at = now()
  where token = p_token and confirmed_at is null;

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

grant execute on function public.confirm_parental_consent(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Chat (1:1 e em grupo, estilo WhatsApp). Exige verificação de identidade
-- (e, se menor de idade, consentimento dos responsáveis) — aplicado na
-- camada de aplicação (src/lib/entitlements.ts), não repetido aqui via
-- RLS, para manter as policies simples.
-- ---------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  is_group boolean not null default false,
  title text,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.dm_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- user_id é a 2ª coluna da PK composta de conversation_participants (não
-- coberta pelo índice da PK, que é ordenado por conversation_id
-- primeiro); dm_messages.conversation_id é filtrado em toda leitura do
-- histórico de uma conversa.
create index if not exists conversation_participants_user_id_idx on public.conversation_participants (user_id);
create index if not exists dm_messages_conversation_id_idx on public.dm_messages (conversation_id);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.dm_messages enable row level security;

drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversations.id and cp.user_id = auth.uid()
    )
  );

drop policy if exists "conversations_insert" on public.conversations;
create policy "conversations_insert"
  on public.conversations for insert
  with check (auth.uid() = created_by);

-- Só quem criou a conversa pode adicionar participantes (o fluxo de
-- "iniciar uma conversa" insere a si mesmo + o(s) outro(s) de uma vez) —
-- não existe aprovação prévia da outra parte, igual DM de WhatsApp/iMessage.
drop policy if exists "conversation_participants_select" on public.conversation_participants;
create policy "conversation_participants_select"
  on public.conversation_participants for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.conversation_participants cp2
      where cp2.conversation_id = conversation_participants.conversation_id and cp2.user_id = auth.uid()
    )
  );

drop policy if exists "conversation_participants_insert" on public.conversation_participants;
create policy "conversation_participants_insert"
  on public.conversation_participants for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_participants.conversation_id and c.created_by = auth.uid()
    )
  );

drop policy if exists "dm_messages_select" on public.dm_messages;
create policy "dm_messages_select"
  on public.dm_messages for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = dm_messages.conversation_id and cp.user_id = auth.uid()
    )
  );

drop policy if exists "dm_messages_insert" on public.dm_messages;
create policy "dm_messages_insert"
  on public.dm_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = dm_messages.conversation_id and cp.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- Comunidades (grupos de estudo abertos, diferentes de turmas — turmas
-- são professor/aluno; comunidades são entre pares, com ou sem um dono).
-- Limite de membros e de quantas comunidades um usuário grátis pode criar
-- é decidido em src/app/actions/communities.ts (mesmo espírito do que já
-- é feito para turmas/cota de IA — regra de produto, não de segurança).
-- ---------------------------------------------------------------------
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_public boolean not null default true,
  join_code text not null unique,
  creator_id uuid not null references auth.users (id) on delete cascade,
  member_cap integer,
  created_at timestamptz not null default now()
);

create table if not exists public.community_members (
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists community_members_user_id_idx on public.community_members (user_id);
create index if not exists community_messages_community_id_idx on public.community_messages (community_id);

alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_messages enable row level security;

drop policy if exists "communities_select" on public.communities;
create policy "communities_select"
  on public.communities for select
  using (
    is_public
    or auth.uid() = creator_id
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = communities.id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "communities_insert" on public.communities;
create policy "communities_insert"
  on public.communities for insert
  with check (auth.uid() = creator_id);

drop policy if exists "communities_delete" on public.communities;
create policy "communities_delete"
  on public.communities for delete
  using (auth.uid() = creator_id);

drop policy if exists "community_members_select" on public.community_members;
create policy "community_members_select"
  on public.community_members for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.community_members cm2
      where cm2.community_id = community_members.community_id and cm2.user_id = auth.uid()
    )
  );

-- Não existe policy de insert direta em community_members — entrar numa
-- comunidade (pública ou por código) sempre passa por join_community
-- abaixo, que também aplica o limite de membros (member_cap).
drop policy if exists "community_messages_select" on public.community_messages;
create policy "community_messages_select"
  on public.community_messages for select
  using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "community_messages_insert" on public.community_messages;
create policy "community_messages_insert"
  on public.community_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = community_messages.community_id and cm.user_id = auth.uid()
    )
  );

-- Junta o usuário atual à comunidade dona do código informado (ou a
-- qualquer comunidade pública, se p_join_code corresponder). "security
-- definer" pelo mesmo motivo de join_turma_by_code: não há policy de
-- select em communities por join_code sem já ser membro. Também é o
-- único lugar que aplica member_cap.
create or replace function public.join_community(p_join_code text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_community_id uuid;
  v_member_cap integer;
  v_member_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select id, member_cap into v_community_id, v_member_cap
  from public.communities where join_code = p_join_code;

  if v_community_id is null then
    raise exception 'community_not_found';
  end if;

  if v_member_cap is not null then
    select count(*) into v_member_count from public.community_members where community_id = v_community_id;
    if v_member_count >= v_member_cap then
      raise exception 'community_full';
    end if;
  end if;

  insert into public.community_members (community_id, user_id, role)
  values (v_community_id, auth.uid(), 'member')
  on conflict (community_id, user_id) do nothing;

  return v_community_id;
end;
$$;

grant execute on function public.join_community(text) to authenticated;

-- Cria a comunidade e já matricula o criador como 'owner' — evitando uma
-- segunda viagem ao banco (e o risco de a policy de insert de
-- community_members barrar o auto-cadastro do criador, já que não há
-- policy de insert direta nessa tabela).
create or replace function public.create_community(
  p_name text,
  p_description text,
  p_is_public boolean,
  p_join_code text,
  p_member_cap integer
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_community_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.communities (name, description, is_public, join_code, creator_id, member_cap)
  values (p_name, p_description, p_is_public, p_join_code, auth.uid(), p_member_cap)
  returning id into v_community_id;

  insert into public.community_members (community_id, user_id, role)
  values (v_community_id, auth.uid(), 'owner');

  return v_community_id;
end;
$$;

grant execute on function public.create_community(text, text, boolean, text, integer) to authenticated;

-- ---------------------------------------------------------------------
-- live_sessions: metadados de salas de vídeo ao vivo (LiveKit Cloud faz a
-- transmissão em si — aqui só guardamos quem/quando/onde). Hospedar uma
-- live é Premium (aplicado em src/app/actions/lives.ts); assistir é livre
-- para quem já tem acesso à comunidade/conversa associada.
-- ---------------------------------------------------------------------
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  room_name text not null unique,
  host_id uuid not null references auth.users (id) on delete cascade,
  community_id uuid references public.communities (id) on delete cascade,
  title text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists live_sessions_host_id_idx on public.live_sessions (host_id);
create index if not exists live_sessions_community_id_idx on public.live_sessions (community_id);

alter table public.live_sessions enable row level security;

drop policy if exists "live_sessions_select" on public.live_sessions;
create policy "live_sessions_select"
  on public.live_sessions for select
  using (
    auth.uid() = host_id
    or community_id is null
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = live_sessions.community_id and cm.user_id = auth.uid()
    )
  );

drop policy if exists "live_sessions_insert" on public.live_sessions;
create policy "live_sessions_insert"
  on public.live_sessions for insert
  with check (
    auth.uid() = host_id
    and (
      community_id is null
      or exists (
        select 1 from public.community_members cm
        where cm.community_id = live_sessions.community_id and cm.user_id = auth.uid()
      )
    )
  );

drop policy if exists "live_sessions_update_own" on public.live_sessions;
create policy "live_sessions_update_own"
  on public.live_sessions for update
  using (auth.uid() = host_id);

-- Resolve o e-mail de um contato para iniciar uma conversa (estilo "iniciar
-- chat com..."), sem expor a tabela auth.users (e sem permitir listar
-- e-mails de terceiros — só confirma se UM e-mail específico já informado
-- corresponde a uma conta, igual ao comportamento comum de "esqueci minha
-- senha").
create or replace function public.find_user_by_email(p_email text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;
  return v_user_id;
end;
$$;

grant execute on function public.find_user_by_email(text) to authenticated;

-- Acha a conversa 1:1 já existente entre o usuário atual e p_other_user_id,
-- ou cria uma nova — evita conversas duplicadas cada vez que alguém clica
-- em "conversar com" a mesma pessoa.
create or replace function public.find_or_create_direct_conversation(p_other_user_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_other_user_id = auth.uid() then
    raise exception 'cannot_chat_with_self';
  end if;

  if exists (
    select 1 from public.blocked_users where blocker_id = p_other_user_id and blocked_id = auth.uid()
  ) then
    raise exception 'blocked';
  end if;

  select cp1.conversation_id into v_conversation_id
  from public.conversation_participants cp1
  join public.conversation_participants cp2 on cp2.conversation_id = cp1.conversation_id
  join public.conversations c on c.id = cp1.conversation_id
  where cp1.user_id = auth.uid()
    and cp2.user_id = p_other_user_id
    and c.is_group = false
  limit 1;

  if v_conversation_id is not null then
    return v_conversation_id;
  end if;

  insert into public.conversations (is_group, created_by)
  values (false, auth.uid())
  returning id into v_conversation_id;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conversation_id, auth.uid()), (v_conversation_id, p_other_user_id);

  return v_conversation_id;
end;
$$;

grant execute on function public.find_or_create_direct_conversation(uuid) to authenticated;

-- Cria uma conversa em grupo com o usuário atual + os membros informados
-- (uuids já resolvidos via find_user_by_email no lado da aplicação).
create or replace function public.create_group_conversation(p_title text, p_member_ids uuid[])
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_conversation_id uuid;
  v_member_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.conversations (is_group, title, created_by)
  values (true, p_title, auth.uid())
  returning id into v_conversation_id;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conversation_id, auth.uid())
  on conflict do nothing;

  foreach v_member_id in array p_member_ids loop
    insert into public.conversation_participants (conversation_id, user_id)
    values (v_conversation_id, v_member_id)
    on conflict do nothing;
  end loop;

  return v_conversation_id;
end;
$$;

grant execute on function public.create_group_conversation(text, uuid[]) to authenticated;

-- Lista as conversas do usuário atual com o nome de exibição do outro
-- participante (só para 1:1) e uma prévia da última mensagem. "security
-- definer" porque profiles só permite ler a própria linha (profiles_select_own)
-- — sem isso, não daria pra mostrar o nome de quem está do outro lado da
-- conversa.
create or replace function public.list_my_conversations()
returns table (
  conversation_id uuid,
  is_group boolean,
  title text,
  peer_display_name text,
  last_message_body text,
  last_message_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  return query
    select
      c.id,
      c.is_group,
      c.title,
      case when not c.is_group then (
        select pr.display_name
        from public.conversation_participants cp2
        join public.profiles pr on pr.id = cp2.user_id
        where cp2.conversation_id = c.id and cp2.user_id != auth.uid()
        limit 1
      ) else null end as peer_display_name,
      (
        select m.body from public.dm_messages m
        where m.conversation_id = c.id
        order by m.created_at desc
        limit 1
      ) as last_message_body,
      (
        select m.created_at from public.dm_messages m
        where m.conversation_id = c.id
        order by m.created_at desc
        limit 1
      ) as last_message_at
    from public.conversations c
    join public.conversation_participants cp on cp.conversation_id = c.id and cp.user_id = auth.uid()
    order by coalesce(
      (select max(m2.created_at) from public.dm_messages m2 where m2.conversation_id = c.id),
      c.created_at
    ) desc;
end;
$$;

grant execute on function public.list_my_conversations() to authenticated;

-- Cabeçalho de uma conversa específica (título/nome do outro participante),
-- pelo mesmo motivo acima. Rejeita quem não é participante da conversa.
create or replace function public.get_conversation_header(p_conversation_id uuid)
returns table (is_group boolean, title text, peer_display_name text)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.conversation_participants
    where conversation_id = p_conversation_id and user_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  return query
    select
      c.is_group,
      c.title,
      case when not c.is_group then (
        select pr.display_name
        from public.conversation_participants cp2
        join public.profiles pr on pr.id = cp2.user_id
        where cp2.conversation_id = c.id and cp2.user_id != auth.uid()
        limit 1
      ) else null end
    from public.conversations c
    where c.id = p_conversation_id;
end;
$$;

grant execute on function public.get_conversation_header(uuid) to authenticated;

-- Todos os participantes de uma conversa com nome de exibição — usado para
-- rotular o remetente de cada mensagem num grupo. Mesma justificativa de
-- security definer das duas funções acima.
create or replace function public.get_conversation_participants(p_conversation_id uuid)
returns table (user_id uuid, display_name text)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.conversation_participants
    where conversation_id = p_conversation_id and user_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  return query
    select cp.user_id, pr.display_name
    from public.conversation_participants cp
    left join public.profiles pr on pr.id = cp.user_id
    where cp.conversation_id = p_conversation_id;
end;
$$;

grant execute on function public.get_conversation_participants(uuid) to authenticated;

-- Membros de uma comunidade com nome de exibição — mesma justificativa de
-- security definer das funções de chat acima (profiles só permite ler a
-- própria linha).
create or replace function public.get_community_members(p_community_id uuid)
returns table (user_id uuid, display_name text, role text, joined_at timestamptz)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.community_members
    where community_id = p_community_id and user_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  return query
    select cm.user_id, pr.display_name, cm.role, cm.joined_at
    from public.community_members cm
    left join public.profiles pr on pr.id = cm.user_id
    where cm.community_id = p_community_id
    order by cm.joined_at asc;
end;
$$;

grant execute on function public.get_community_members(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Moderação: bloquear usuários (chat), denunciar mensagens (chat e
-- comunidades) e sair/remover membros de grupos e comunidades. Denúncias
-- não têm policy de select para "authenticated" de propósito — não existe
-- painel de moderação nesta versão, então revisar denúncias é um passo
-- manual (via SQL/dashboard do Supabase, com a service_role key).
-- ---------------------------------------------------------------------
create table if not exists public.blocked_users (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.message_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  message_table text not null check (message_table in ('dm_messages', 'community_messages')),
  message_id uuid not null,
  reason text,
  created_at timestamptz not null default now()
);

-- blocked_id é a 2ª coluna da PK composta (não coberta pelo índice da PK,
-- ordenado por blocker_id primeiro) — usada para checar "fulano me
-- bloqueou?" ao renderizar mensagens/chat.
create index if not exists blocked_users_blocked_id_idx on public.blocked_users (blocked_id);

alter table public.blocked_users enable row level security;
alter table public.message_reports enable row level security;

drop policy if exists "blocked_users_select_own" on public.blocked_users;
create policy "blocked_users_select_own"
  on public.blocked_users for select
  using (auth.uid() = blocker_id);

drop policy if exists "blocked_users_insert_own" on public.blocked_users;
create policy "blocked_users_insert_own"
  on public.blocked_users for insert
  with check (auth.uid() = blocker_id and blocker_id != blocked_id);

drop policy if exists "blocked_users_delete_own" on public.blocked_users;
create policy "blocked_users_delete_own"
  on public.blocked_users for delete
  using (auth.uid() = blocker_id);

drop policy if exists "message_reports_insert_own" on public.message_reports;
create policy "message_reports_insert_own"
  on public.message_reports for insert
  with check (auth.uid() = reporter_id);

-- Passa a barrar o envio de mensagens diretas de quem já foi bloqueado por
-- QUALQUER outro participante da conversa (não só numa 1:1) — bloquear
-- alguém impede que essa pessoa fale com você em qualquer conversa
-- compartilhada, não só esconde a mensagem na tela.
drop policy if exists "dm_messages_insert" on public.dm_messages;
create policy "dm_messages_insert"
  on public.dm_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = dm_messages.conversation_id and cp.user_id = auth.uid()
    )
    and not exists (
      select 1 from public.blocked_users b
      join public.conversation_participants cp2 on cp2.user_id = b.blocker_id
      where cp2.conversation_id = dm_messages.conversation_id and b.blocked_id = auth.uid()
    )
  );

-- Denuncia uma mensagem de chat ou de comunidade. Confirma que quem denuncia
-- realmente tinha acesso a essa mensagem (é participante/membro) antes de
-- aceitar a denúncia, para não virar um jeito de "adivinhar" ids de mensagem.
create or replace function public.report_message(p_message_table text, p_message_id uuid, p_reason text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_has_access boolean;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_message_table = 'dm_messages' then
    select exists (
      select 1 from public.dm_messages m
      join public.conversation_participants cp on cp.conversation_id = m.conversation_id
      where m.id = p_message_id and cp.user_id = auth.uid()
    ) into v_has_access;
  elsif p_message_table = 'community_messages' then
    select exists (
      select 1 from public.community_messages m
      join public.community_members cm on cm.community_id = m.community_id
      where m.id = p_message_id and cm.user_id = auth.uid()
    ) into v_has_access;
  else
    raise exception 'invalid_message_table';
  end if;

  if not v_has_access then
    raise exception 'not_authorized';
  end if;

  insert into public.message_reports (reporter_id, message_table, message_id, reason)
  values (auth.uid(), p_message_table, p_message_id, p_reason);
end;
$$;

grant execute on function public.report_message(text, uuid, text) to authenticated;

-- Dono da comunidade remove um membro (não pode remover a si mesmo — para
-- isso, exclua a comunidade). Sem policy de delete direta em
-- community_members de propósito, igual ao motivo de não ter policy de
-- insert direta: toda remoção passa por aqui ou por leave_community.
create or replace function public.remove_community_member(p_community_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.communities where id = p_community_id and creator_id = auth.uid()
  ) then
    raise exception 'not_authorized';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'cannot_remove_self';
  end if;

  delete from public.community_members where community_id = p_community_id and user_id = p_user_id;
end;
$$;

grant execute on function public.remove_community_member(uuid, uuid) to authenticated;

-- Qualquer membro sai de uma comunidade por conta própria (ex: se sentir
-- desconfortável). O dono não pode sair por aqui — precisa excluir a
-- comunidade (deixaria a comunidade sem dono).
create or replace function public.leave_community(p_community_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if exists (select 1 from public.communities where id = p_community_id and creator_id = auth.uid()) then
    raise exception 'owner_cannot_leave';
  end if;

  delete from public.community_members where community_id = p_community_id and user_id = auth.uid();
end;
$$;

grant execute on function public.leave_community(uuid) to authenticated;

-- Quem criou um grupo de chat remove um participante (não pode remover a si
-- mesmo, e só vale para grupos — numa 1:1 a saída é bloquear a pessoa).
create or replace function public.remove_conversation_participant(p_conversation_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.conversations
    where id = p_conversation_id and created_by = auth.uid() and is_group = true
  ) then
    raise exception 'not_authorized';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'cannot_remove_self';
  end if;

  delete from public.conversation_participants where conversation_id = p_conversation_id and user_id = p_user_id;
end;
$$;

grant execute on function public.remove_conversation_participant(uuid, uuid) to authenticated;

-- Qualquer participante sai de um grupo por conta própria. Quem criou o
-- grupo também pode sair (diferente de comunidades, um grupo de chat
-- continua funcionando sem "dono" — ninguém mais depende desse papel).
create or replace function public.leave_group_conversation(p_conversation_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (select 1 from public.conversations where id = p_conversation_id and is_group = true) then
    raise exception 'not_a_group';
  end if;

  delete from public.conversation_participants where conversation_id = p_conversation_id and user_id = auth.uid();
end;
$$;

grant execute on function public.leave_group_conversation(uuid) to authenticated;

-- Lista de quem o usuário atual bloqueou, com nome de exibição — mesma
-- justificativa de security definer das outras funções de roster acima.
-- Bloquear/desbloquear em si não precisa de RPC: as policies
-- blocked_users_insert_own/blocked_users_delete_own já permitem inserir e
-- apagar a própria linha diretamente.
create or replace function public.get_blocked_users()
returns table (blocked_id uuid, display_name text, created_at timestamptz)
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  return query
    select b.blocked_id, pr.display_name, b.created_at
    from public.blocked_users b
    left join public.profiles pr on pr.id = b.blocked_id
    where b.blocker_id = auth.uid()
    order by b.created_at desc;
end;
$$;

grant execute on function public.get_blocked_users() to authenticated;

-- ---------------------------------------------------------------------
-- Grafo de conhecimento, Fase 2: embeddings de cada tópico do currículo
-- (gerados por scripts/generate-topic-embeddings.ts, via a API da Voyage
-- AI) para achar tópicos relacionados por similaridade semântica, em vez
-- de depender só da curadoria manual (`relatedTopics` em curriculum.ts —
-- ver "Sobre a integração de conhecimento" no README). Conteúdo público
-- do currículo, sem dado de usuário nenhum — RLS libera leitura geral,
-- só o script (via service_role) escreve.
-- ---------------------------------------------------------------------
create extension if not exists vector;

create table if not exists public.topic_embeddings (
  level_id text not null,
  topic_id text not null,
  content_hash text not null,
  embedding vector(1024) not null,
  updated_at timestamptz not null default now(),
  primary key (level_id, topic_id)
);

alter table public.topic_embeddings enable row level security;

drop policy if exists "topic_embeddings_select_all" on public.topic_embeddings;
create policy "topic_embeddings_select_all"
  on public.topic_embeddings for select
  using (true);

-- Acha os tópicos semanticamente mais parecidos com um tópico dado, por
-- distância de cosseno (<=>, operador do pgvector). Retorna vazio se esse
-- tópico ainda não tem embedding gerado (ex: script nunca rodou).
create or replace function public.match_related_topics(p_level_id text, p_topic_id text, p_match_count int default 5)
returns table (level_id text, topic_id text, similarity float)
language plpgsql
security definer set search_path = public
as $$
declare
  v_embedding vector(1024);
begin
  select embedding into v_embedding
  from public.topic_embeddings
  where level_id = p_level_id and topic_id = p_topic_id;

  if v_embedding is null then
    return;
  end if;

  return query
    select te.level_id, te.topic_id, 1 - (te.embedding <=> v_embedding) as similarity
    from public.topic_embeddings te
    where not (te.level_id = p_level_id and te.topic_id = p_topic_id)
    order by te.embedding <=> v_embedding asc
    limit p_match_count;
end;
$$;

grant execute on function public.match_related_topics(text, text, int) to authenticated, anon;

-- ---------------------------------------------------------------------
-- Painel de moderação: quem é admin, status de denúncias, e banimento de
-- recursos sociais. Sem UI de auto-promoção a admin de propósito — a
-- tabela admins só é gravada via SQL direto pelo dono do projeto (ver
-- "Sobre o painel de moderação" no README), mesmo espírito de
-- identity_verifications/subscriptions (só service_role escreve).
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins_select_own" on public.admins;
create policy "admins_select_own"
  on public.admins for select
  using (auth.uid() = user_id);

-- Sem policy de insert/update/delete para authenticated — promover alguém a
-- admin é um passo manual (INSERT direto via SQL Editor do Supabase).

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

alter table public.message_reports
  add column if not exists status text not null default 'pending' check (status in ('pending', 'dismissed', 'action_taken')),
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users (id) on delete set null;

-- Para instalações que já tinham resolved_by antes dele ganhar "on delete
-- set null" (add column if not exists não altera uma coluna existente):
-- refaz a FK com o mesmo nome padrão do Postgres para uma constraint
-- inline (<tabela>_<coluna>_fkey).
alter table public.message_reports drop constraint if exists message_reports_resolved_by_fkey;
alter table public.message_reports
  add constraint message_reports_resolved_by_fkey foreign key (resolved_by) references auth.users (id) on delete set null;

-- banned_by fica nulo se a conta do admin que baniu for excluída — preserva
-- o histórico de moderação (quem foi banido e por quê) em vez de apagar o
-- banimento junto (cascade) ou impedir a exclusão da conta do admin
-- (comportamento padrão sem "on delete").
create table if not exists public.banned_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  banned_by uuid references auth.users (id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

-- Para instalações que já rodaram este arquivo antes de banned_by virar
-- opcional (create table if not exists não altera uma tabela existente):
-- solta o not null e troca a FK por on delete set null.
alter table public.banned_users alter column banned_by drop not null;
alter table public.banned_users drop constraint if exists banned_users_banned_by_fkey;
alter table public.banned_users
  add constraint banned_users_banned_by_fkey foreign key (banned_by) references auth.users (id) on delete set null;

alter table public.banned_users enable row level security;

-- Um usuário pode ver a própria linha (para saber que foi banido dos
-- recursos sociais — ver getSocialAccessStatus() em src/lib/entitlements.ts).
-- Sem policy de insert/update/delete para authenticated — banir/desbanir
-- sempre passa pelas RPCs ban_user/unban_user abaixo, que checam is_admin().
drop policy if exists "banned_users_select_own" on public.banned_users;
create policy "banned_users_select_own"
  on public.banned_users for select
  using (auth.uid() = user_id);

-- Lista denúncias pendentes com o conteúdo da mensagem denunciada e nomes de
-- exibição de quem denunciou/enviou — só para admins. Une dm_messages e
-- community_messages (message_table decide qual) porque message_reports não
-- tem uma FK polimórfica de verdade.
create or replace function public.list_message_reports()
returns table (
  report_id uuid,
  message_table text,
  message_id uuid,
  context_id uuid,
  body text,
  sender_id uuid,
  sender_name text,
  reporter_id uuid,
  reporter_name text,
  status text,
  created_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  return query
    select
      r.id,
      r.message_table,
      r.message_id,
      case when r.message_table = 'dm_messages' then dm.conversation_id else cm.community_id end,
      case when r.message_table = 'dm_messages' then dm.body else cm.body end,
      case when r.message_table = 'dm_messages' then dm.sender_id else cm.sender_id end,
      pr_sender.display_name,
      r.reporter_id,
      pr_reporter.display_name,
      r.status,
      r.created_at
    from public.message_reports r
    left join public.dm_messages dm on r.message_table = 'dm_messages' and dm.id = r.message_id
    left join public.community_messages cm on r.message_table = 'community_messages' and cm.id = r.message_id
    left join public.profiles pr_sender
      on pr_sender.id = (case when r.message_table = 'dm_messages' then dm.sender_id else cm.sender_id end)
    left join public.profiles pr_reporter on pr_reporter.id = r.reporter_id
    order by r.status = 'pending' desc, r.created_at desc;
end;
$$;

grant execute on function public.list_message_reports() to authenticated;

-- Marca uma denúncia como resolvida (dispensada ou com ação tomada) — só
-- para admins.
create or replace function public.resolve_report(p_report_id uuid, p_status text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  if p_status not in ('dismissed', 'action_taken') then
    raise exception 'invalid_status';
  end if;

  update public.message_reports
  set status = p_status, resolved_at = now(), resolved_by = auth.uid()
  where id = p_report_id;
end;
$$;

grant execute on function public.resolve_report(uuid, text) to authenticated;

-- Bane um usuário dos recursos sociais (chat/comunidades/lives) — só para
-- admins. Não impede login nem acesso ao conteúdo educacional, só ao
-- social; ver getSocialAccessStatus().
create or replace function public.ban_user(p_user_id uuid, p_reason text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  insert into public.banned_users (user_id, banned_by, reason)
  values (p_user_id, auth.uid(), p_reason)
  on conflict (user_id) do update set reason = excluded.reason, banned_by = excluded.banned_by;
end;
$$;

grant execute on function public.ban_user(uuid, text) to authenticated;

create or replace function public.unban_user(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  delete from public.banned_users where user_id = p_user_id;
end;
$$;

grant execute on function public.unban_user(uuid) to authenticated;

-- Quais dos ids informados estão banidos dos recursos sociais — só para
-- admins (banned_users_select_own só deixa cada um ver a própria linha, o
-- que não serve para um admin revisar o status de outros usuários).
create or replace function public.get_banned_user_ids(p_user_ids uuid[])
returns table (user_id uuid)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  return query
    select b.user_id from public.banned_users b where b.user_id = any(p_user_ids);
end;
$$;

grant execute on function public.get_banned_user_ids(uuid[]) to authenticated;

-- ---------------------------------------------------------------------
-- Liga semanal: ranking opt-in de XP ganho na semana corrente.
--
-- Não há tabela nova de pontuação: o XP semanal é derivado do xp_log
-- (mapa data -> XP) que gamification_state já sincroniza. Só participa
-- (e aparece) quem ligou leaderboard_opt_in no próprio profile, e a
-- função devolve apenas display_name/XP/posição — nunca user ids.
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists leaderboard_opt_in boolean not null default false;

create or replace function public.get_weekly_leaderboard()
returns table (display_name text, weekly_xp integer, rank bigint)
language sql
security definer set search_path = public
stable
as $$
  with weekly as (
    select
      coalesce(nullif(trim(p.display_name), ''), 'Estudante') as display_name,
      coalesce((
        select sum((entry.value)::integer)
        from jsonb_each_text(g.xp_log) as entry(key, value)
        where entry.key::date >= date_trunc('week', now())::date
      ), 0)::integer as weekly_xp
    from public.gamification_state g
    join public.profiles p on p.id = g.user_id
    where p.leaderboard_opt_in
  )
  select w.display_name, w.weekly_xp, rank() over (order by w.weekly_xp desc) as rank
  from weekly w
  where w.weekly_xp > 0
  order by w.weekly_xp desc, w.display_name
  limit 20;
$$;

grant execute on function public.get_weekly_leaderboard() to authenticated;

-- ---------------------------------------------------------------------
-- Histórico: conversas com o tutor Gauss e problemas resolvidos por foto,
-- pra o aluno poder revisitar depois em /historico — hoje as duas coisas
-- vivem só em memória do componente (TutorChat/usePhotoSolve) e somem ao
-- recarregar a página.
--
-- Como as duas tabelas guardam só o próprio conteúdo do usuário (não há
-- leitura cruzada entre usuários, ao contrário de turmas/comunidades), a
-- API grava direto pela policy "own" (for all) em vez de passar por uma
-- RPC security definer.
-- ---------------------------------------------------------------------
create table if not exists public.gauss_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- gauss_messages: uma linha por mensagem (usuário ou assistente) de uma
-- conversa. Sem user_id próprio — a policy de acesso é derivada do dono
-- da conversa (gauss_conversations.user_id) via subquery.
create table if not exists public.gauss_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.gauss_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists gauss_conversations_user_id_idx on public.gauss_conversations (user_id);
create index if not exists gauss_messages_conversation_id_idx on public.gauss_messages (conversation_id);

alter table public.gauss_conversations enable row level security;
alter table public.gauss_messages enable row level security;

drop policy if exists "gauss_conversations_own" on public.gauss_conversations;
create policy "gauss_conversations_own"
  on public.gauss_conversations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "gauss_messages_own" on public.gauss_messages;
create policy "gauss_messages_own"
  on public.gauss_messages for all
  using (
    exists (
      select 1 from public.gauss_conversations gc
      where gc.id = gauss_messages.conversation_id and gc.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.gauss_conversations gc
      where gc.id = gauss_messages.conversation_id and gc.user_id = auth.uid()
    )
  );

-- photo_solve_history: uma linha por problema resolvido com sucesso em
-- /foto ou /quadro (mesmo formato de PhotoSolution: enunciado/passos/
-- resposta). Não distingue a origem (foto vs quadro) — do ponto de vista
-- do histórico é só "um problema que a IA resolveu para o aluno".
create table if not exists public.photo_solve_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  enunciado text not null default '',
  passos jsonb not null default '[]'::jsonb,
  resposta text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists photo_solve_history_user_id_idx on public.photo_solve_history (user_id);

alter table public.photo_solve_history enable row level security;

drop policy if exists "photo_solve_history_own" on public.photo_solve_history;
create policy "photo_solve_history_own"
  on public.photo_solve_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

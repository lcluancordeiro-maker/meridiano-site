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

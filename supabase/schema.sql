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

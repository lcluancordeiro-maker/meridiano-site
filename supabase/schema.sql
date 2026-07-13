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

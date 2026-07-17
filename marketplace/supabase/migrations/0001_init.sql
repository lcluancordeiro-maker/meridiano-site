-- Precatta marketplace schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tipo text not null default 'comprador' check (tipo in ('comprador','vendedor','ambos')),
  nome text not null default '',
  empresa text,
  telefone text,
  cpf_cnpj text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row whenever a new auth user signs up,
-- using metadata passed to supabase.auth.signUp({ options: { data: { ... } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, tipo, nome, empresa, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'tipo', 'comprador'),
    coalesce(new.raw_user_meta_data->>'nome', ''),
    new.raw_user_meta_data->>'empresa',
    new.raw_user_meta_data->>'telefone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- LISTINGS ----------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  tipo_ativo text not null default 'precatorio' check (tipo_ativo in ('precatorio','ativo_judicial')),
  ente_devedor text not null,
  esfera text not null check (esfera in ('federal','estadual','municipal')),
  tribunal text not null,
  numero_processo text,
  natureza text not null default 'comum' check (natureza in ('alimentar','comum')),
  valor_de_face numeric(14,2) not null check (valor_de_face > 0),
  valor_pedido numeric(14,2) not null check (valor_pedido > 0),
  data_expedicao date,
  previsao_pagamento text,
  estado text not null,
  comarca text,
  descricao text,
  status text not null default 'disponivel' check (status in ('disponivel','em_negociacao','vendido','removido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "listings_select_public"
  on public.listings for select
  to anon, authenticated
  using (status = 'disponivel');

create policy "listings_select_own"
  on public.listings for select
  to authenticated
  using (seller_id = auth.uid());

create policy "listings_insert_own"
  on public.listings for insert
  to authenticated
  with check (seller_id = auth.uid());

create policy "listings_update_own"
  on public.listings for update
  to authenticated
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

create policy "listings_delete_own"
  on public.listings for delete
  to authenticated
  using (seller_id = auth.uid());

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- ---------- PROPOSALS ----------
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  valor_proposto numeric(14,2) not null check (valor_proposto > 0),
  mensagem text,
  status text not null default 'pendente' check (status in ('pendente','aceita','recusada','contraproposta')),
  resposta_vendedor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.proposals enable row level security;

create policy "proposals_select_buyer_or_seller"
  on public.proposals for select
  to authenticated
  using (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.listings l
      where l.id = proposals.listing_id and l.seller_id = auth.uid()
    )
  );

create policy "proposals_insert_buyer"
  on public.proposals for insert
  to authenticated
  with check (buyer_id = auth.uid());

create policy "proposals_update_seller"
  on public.proposals for update
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = proposals.listing_id and l.seller_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = proposals.listing_id and l.seller_id = auth.uid()
    )
  );

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at
  before update on public.proposals
  for each row execute function public.set_updated_at();

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_estado_idx on public.listings (estado);
create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists proposals_listing_idx on public.proposals (listing_id);
create index if not exists proposals_buyer_idx on public.proposals (buyer_id);

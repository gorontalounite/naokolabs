-- Tahap 3 BUILD-PLAN: identitas, workspace (organisasi), keanggotaan dan brand.
-- Acuan: docs/DATA-MODEL.md (Identitas, Klien) dan docs/READINESS-BACKLOG.md (matriks peran awal).
--
-- Model peran:
--   memberships.role  : owner | member  -> peran klien di dalam satu workspace.
--   profiles.staff_role: operator | admin -> staf layanan. Belum memberi akses lintas klien;
--                        akses operator/admin dibuat terpisah dengan audit (TBD).
-- Semua data milik klien membawa organization_id dan dibatasi RLS.

create type public.member_role as enum ('owner', 'member');
create type public.staff_role as enum ('operator', 'admin');

-- Profil pengguna -----------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  staff_role public.staff_role,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Workspace -----------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index memberships_user_id_idx on public.memberships (user_id);

-- Brand ---------------------------------------------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index brands_organization_id_idx on public.brands (organization_id);

-- updated_at ----------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();

-- Helper akses (security definer agar policy tidak rekursif lewat RLS memberships) --

create function public.is_org_member(org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org and m.user_id = (select auth.uid())
  );
$$;

create function public.is_org_owner(org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org and m.user_id = (select auth.uid()) and m.role = 'owner'
  );
$$;

revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.is_org_owner(uuid) from public, anon;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;

-- Membuat workspace baru: organisasi + keanggotaan owner dalam satu transaksi.

create function public.create_organization(org_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  new_id uuid;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  insert into public.organizations (name, created_by) values (trim(org_name), uid) returning id into new_id;
  insert into public.memberships (organization_id, user_id, role) values (new_id, uid, 'owner');
  return new_id;
end;
$$;

revoke execute on function public.create_organization(text) from public, anon;
grant execute on function public.create_organization(text) to authenticated;

-- Pengguna baru: profil + workspace pribadi -----------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  display_name text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), '');
  new_org uuid;
begin
  insert into public.profiles (id, full_name) values (new.id, display_name);

  insert into public.organizations (name, created_by)
  values (left('Workspace ' || coalesce(display_name, split_part(new.email, '@', 1), 'baru'), 120), new.id)
  returning id into new_org;

  insert into public.memberships (organization_id, user_id, role) values (new_org, new.id, 'owner');
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security ----------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.brands enable row level security;

-- Tidak ada akses anon ke tabel mana pun.
revoke all on public.profiles, public.organizations, public.memberships, public.brands from anon;

-- profiles: pengguna hanya melihat dan mengubah namanya sendiri; staff_role tidak bisa diubah klien.
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

create policy "profiles: baca milik sendiri" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: ubah milik sendiri" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- organizations: anggota membaca; owner mengganti nama. Pembuatan lewat create_organization().
revoke insert, update, delete on public.organizations from authenticated;
grant select on public.organizations to authenticated;
grant update (name) on public.organizations to authenticated;

create policy "organizations: anggota membaca" on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy "organizations: owner mengubah" on public.organizations
  for update to authenticated using (public.is_org_owner(id)) with check (public.is_org_owner(id));

-- memberships: anggota melihat sesama anggota. Undangan dan perubahan peran belum dibuka
-- untuk klien (alur undangan TBD), jadi tidak ada policy tulis.
revoke insert, update, delete on public.memberships from authenticated;
grant select on public.memberships to authenticated;

create policy "memberships: anggota membaca" on public.memberships
  for select to authenticated using (public.is_org_member(organization_id));

-- brands: anggota membaca; owner membuat, mengubah dan menghapus.
revoke all on public.brands from authenticated;
grant select, delete on public.brands to authenticated;
grant insert (organization_id, name), update (name) on public.brands to authenticated;

create policy "brands: anggota membaca" on public.brands
  for select to authenticated using (public.is_org_member(organization_id));
create policy "brands: owner menambah" on public.brands
  for insert to authenticated with check (public.is_org_owner(organization_id));
create policy "brands: owner mengubah" on public.brands
  for update to authenticated using (public.is_org_owner(organization_id)) with check (public.is_org_owner(organization_id));
create policy "brands: owner menghapus" on public.brands
  for delete to authenticated using (public.is_org_owner(organization_id));

-- Paste these statements into Supabase SQL editor

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  role text check (role in ('pilot','admin','trainer')) not null default 'pilot',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_read_own_or_admin"
on public.profiles for select
using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create table if not exists public.boats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  active boolean not null default true,
  created_at timestamptz default now()
);
alter table public.boats enable row level security;
create policy "boats_read_all" on public.boats for select using (true);

create policy "boats_admin_write"
on public.boats for all
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create type frequency as enum ('daily','weekly','adhoc');

create table if not exists public.form_templates (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  frequency frequency not null default 'daily',
  schema_json jsonb not null,
  allow_attachments boolean not null default true,
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.form_templates enable row level security;
create policy "form_templates_read_all" on public.form_templates for select using (true);
create policy "form_templates_admin_write"
on public.form_templates for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.form_templates(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  boat_id uuid,
  period_date date not null,
  data jsonb not null default '{}'::jsonb,
  status text check (status in ('submitted','approved','rejected')) not null default 'submitted',
  created_at timestamptz default now()
);
alter table public.form_submissions enable row level security;
create policy "form_submissions_read_own_or_admin"
on public.form_submissions for select
using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "form_submissions_insert_own"
on public.form_submissions for insert with check (user_id = auth.uid());

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.form_submissions(id) on delete cascade,
  path text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table public.uploads enable row level security;
create policy "uploads_read_own_or_admin"
on public.uploads for select
using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "uploads_insert_own"
on public.uploads for insert with check (user_id = auth.uid());

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  published_at timestamptz default now(),
  created_by uuid references public.profiles(id)
);
alter table public.news enable row level security;
create policy "news_read_all" on public.news for select using (true);
create policy "news_admin_write"
on public.news for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  data jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.shifts enable row level security;
create policy "shifts_read_all" on public.shifts for select using (true);
create policy "shifts_admin_write"
on public.shifts for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.training_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  required boolean not null default true,
  created_at timestamptz default now()
);
alter table public.training_modules enable row level security;
create policy "training_read_all" on public.training_modules for select using (true);
create policy "training_admin_write"
on public.training_modules for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.training_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  module_id uuid references public.training_modules(id) on delete cascade,
  status text check (status in ('todo','in_progress','done')) not null default 'todo',
  updated_at timestamptz default now(),
  primary key (user_id, module_id)
);
alter table public.training_progress enable row level security;
create policy "training_progress_read_own_or_admin"
on public.training_progress for select
using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "training_progress_write_own"
on public.training_progress for all using (user_id = auth.uid());

create table if not exists public.onboarding_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  has_quiz boolean not null default false,
  created_at timestamptz default now()
);
alter table public.onboarding_items enable row level security;
create policy "onb_read_all" on public.onboarding_items for select using (true);
create policy "onb_admin_write"
on public.onboarding_items for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.onboarding_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  item_id uuid references public.onboarding_items(id) on delete cascade,
  status text check (status in ('todo','done')) not null default 'todo',
  completed_at timestamptz,
  primary key (user_id, item_id)
);
alter table public.onboarding_progress enable row level security;
create policy "onb_progress_read_own_or_admin"
on public.onboarding_progress for select
using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "onb_progress_write_own"
on public.onboarding_progress for all using (user_id = auth.uid());

create table if not exists public.levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_points int not null default 0,
  benefits jsonb not null default '[]'::jsonb
);
alter table public.levels enable row level security;
create policy "levels_read_all" on public.levels for select using (true);
create policy "levels_admin_write"
on public.levels for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create table if not exists public.user_levels (
  user_id uuid references public.profiles(id) on delete cascade,
  level_id uuid references public.levels(id) on delete restrict,
  points int not null default 0,
  assigned_at timestamptz default now(),
  primary key (user_id)
);
alter table public.user_levels enable row level security;
create policy "user_levels_read_own_or_admin"
on public.user_levels for select
using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "user_levels_admin_write"
on public.user_levels for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

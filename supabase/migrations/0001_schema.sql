-- PossAbilities Portal: schema. Run once on the portal Supabase (self-hosted on Ryan's Cloud).
create extension if not exists pgcrypto;

-- ---------- people ----------
create type public.user_role as enum ('user','staff','admin');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text, display_name text,
  role public.user_role not null default 'user',
  support_worker_email text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  text_size text not null default 'medium' check (text_size in ('small','medium','large')),
  theme text not null default 'standard' check (theme in ('standard','contrast','calm','dark')),
  read_aloud boolean not null default true,
  pictures boolean not null default true,
  simplified boolean not null default false,
  updated_at timestamptz not null default now()
);
-- Create a profile row the moment someone signs in for the first time via magic link.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'display_name')
  on conflict (id) do nothing;
  insert into public.user_settings (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','admin'));
$$;

-- ---------- synced content ----------
-- source/source_id make every synced row idempotent: re-running a sync upserts instead of duplicating.
create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'manual', source_id text,
  title text not null, summary text, body_easy text,
  image_url text, audio_url text, read_minutes int,
  easy_read_doc_id uuid,
  published_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source, source_id)
);
create table public.easy_read_docs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'easyread', source_id text,
  title text not null, category text,
  steps jsonb not null default '[]'::jsonb,   -- [{text, icon, image_url}]
  audio_url text, source_url text,
  published_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source, source_id)
);
alter table public.news_posts add constraint news_easy_read_fk foreign key (easy_read_doc_id) references public.easy_read_docs(id) on delete set null;
create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'workshops', source_id text,
  title text not null, summary text, cover_url text,
  next_session_at timestamptz,
  published_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source, source_id)
);
create table public.workshop_steps (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  source_id text,
  position int not null, title text not null, subtitle text,
  kind text not null check (kind in ('workbook','slides','easyread','video','session')),
  resource_url text,
  unique (workshop_id, position)
);
create table public.workshop_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  step_id uuid not null references public.workshop_steps(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'tv', source_id text,
  title text not null, description text,
  playback_url text, poster_url text, captions_url text, duration_s int,
  published_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source, source_id)
);
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name text not null, description text,
  colour text not null default 'lilac' check (colour in ('purple','pink','teal','lilac')),
  next_meetup_at timestamptz, created_at timestamptz not null default now()
);
create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(), primary key (group_id, user_id)
);
create table public.group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null, body text, image_url text,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.sync_runs (
  id bigint generated always as identity primary key,
  source text not null, started_at timestamptz not null default now(), finished_at timestamptz,
  items int default 0, status text not null default 'running', error text
);
create index on public.news_posts (published_at desc);
create index on public.easy_read_docs (published_at desc);
create index on public.videos (published_at desc);
create index on public.group_posts (group_id, created_at desc);

-- ---------- row-level security ----------
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.news_posts enable row level security;
alter table public.easy_read_docs enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_steps enable row level security;
alter table public.workshop_progress enable row level security;
alter table public.videos enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_posts enable row level security;
alter table public.sync_runs enable row level security;

-- own rows
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "own settings" on public.user_settings for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own progress" on public.workshop_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
-- content: everyone signed in can read; staff can write (sync uses the service role, which bypasses RLS)
create policy "read news" on public.news_posts for select to authenticated using (true);
create policy "read easyread" on public.easy_read_docs for select to authenticated using (true);
create policy "read workshops" on public.workshops for select to authenticated using (true);
create policy "read steps" on public.workshop_steps for select to authenticated using (true);
create policy "read videos" on public.videos for select to authenticated using (true);
create policy "read groups" on public.groups for select to authenticated using (true);
create policy "staff write news" on public.news_posts for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff write easyread" on public.easy_read_docs for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff write workshops" on public.workshops for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff write steps" on public.workshop_steps for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff write videos" on public.videos for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff write groups" on public.groups for all to authenticated using (public.is_staff()) with check (public.is_staff());
-- groups: see your own membership; posts only visible to members (or staff)
create policy "own membership" on public.group_members for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "staff manage members" on public.group_members for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "member posts" on public.group_posts for select to authenticated using (public.is_staff() or exists (select 1 from public.group_members m where m.group_id = group_posts.group_id and m.user_id = auth.uid()));
create policy "staff write posts" on public.group_posts for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff read sync" on public.sync_runs for select to authenticated using (public.is_staff());

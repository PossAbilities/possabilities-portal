-- PossAbilities Community Hub — Supabase schema
-- Run in your Supabase project: SQL Editor → New query → Run.

-- =====================  NEWS POSTS  =====================
create table if not exists news_posts (
  id          text primary key,
  category    text not null default '',
  title       text not null default '',
  excerpt     text not null default '',
  image       text not null default '',
  created_at  timestamptz not null default now()
);
alter table news_posts enable row level security;
create policy "news public read"  on news_posts for select using (true);
create policy "news admin write"  on news_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =====================  EVENTS  =====================
create table if not exists events (
  id           text primary key,
  title        text not null default '',
  description  text not null default '',
  "dateLabel"  text not null default '',
  "timeLabel"  text not null default '',
  image        text not null default '',
  free         boolean not null default false,
  price        text not null default 'Free',
  created_at   timestamptz not null default now()
);
alter table events enable row level security;
create policy "events public read" on events for select using (true);
create policy "events admin write" on events for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =====================  POLICIES  =====================
create table if not exists policies (
  id          text primary key,
  title       text not null default '',
  description text not null default '',
  image       text not null default '',
  body        text not null default '',
  created_at  timestamptz not null default now()
);
alter table policies enable row level security;
create policy "policies public read" on policies for select using (true);
create policy "policies admin write" on policies for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =====================  REQUESTS (admin inbox)  =====================
-- Receives every public submission: suggested events, feedback, concerns
-- (whistleblowing), compliments and ticket requests.
create table if not exists requests (
  id            text primary key,
  kind          text not null default 'FEEDBACK',  -- NEWS | EVENT | FEEDBACK | CONCERN | COMPLIMENT
  subject       text not null default '',
  submitted_by  text not null default 'Anonymous',
  status        text not null default 'Pending',   -- Pending | Investigating | Resolved
  detail        jsonb not null default '{}',
  created_at    timestamptz not null default now()
);
alter table requests enable row level security;
-- Anyone may submit a request (the public forms)…
create policy "requests public insert" on requests for insert with check (true);
-- …but only signed-in admins may read or update them.
create policy "requests admin read"   on requests for select using (auth.role() = 'authenticated');
create policy "requests admin update" on requests for update using (auth.role() = 'authenticated');

-- =====================  NOTES  =====================
-- 1. Create an admin user under Authentication → Users; sign in at /login.
-- 2. news_posts / events / policies are optional to populate — the app falls
--    back to built-in seed content until these tables have rows.
-- 3. The "requests" table is the live one: public forms write here and the
--    admin dashboard reads/updates it.

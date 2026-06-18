-- PossAbilities Community Hub — Supabase schema
-- Run in your Supabase project: SQL Editor → New query → Run.
--
-- NOTE: your project already has `news_posts` and `events` tables with content,
-- and the app reads them as-is (news_posts.featured_image may be a URL or a
-- Tailwind gradient class; events use a single ISO `date`). This script only
-- adds the two MISSING tables the app needs: `requests` and `policies`.

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

-- =====================  POLICIES (Easy-Read library)  =====================
-- Optional — until populated, the Support page shows built-in seed policies.
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

-- =====================  ADMIN SIGN-IN  =====================
-- Create an admin user under Authentication → Users, then sign in at /login.

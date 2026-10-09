-- Two more "make it work for me" switches. Both off by default.
alter table public.user_settings
  add column if not exists sounds boolean not null default false,
  add column if not exists reduce_motion boolean not null default false;

-- Calendar moments: on these days a particular character (and pose) greets people on Home with a line.
-- from_md / to_md are month-day strings like '10-10'; a range may wrap the year ('12-31' to '01-01').
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  from_md text not null check (from_md ~ '^\d\d-\d\d$'),
  to_md text not null check (to_md ~ '^\d\d-\d\d$'),
  character text not null check (character in ('billy','luca','orla','eliza','nadia')),
  pose text,
  line text not null,
  created_at timestamptz not null default now()
);
alter table public.moments enable row level security;
create policy "moments are readable by signed-in people" on public.moments for select to authenticated using (true);
create policy "staff manage moments" on public.moments for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','admin')));

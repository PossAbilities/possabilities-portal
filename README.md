# PossAbilities Community Portal

An accessible community portal for the people PossAbilities supports — built from the
Google Stitch "Community Hub" design. Browse news and events, book tickets, find
easy-read support and policies, send feedback or report a concern; admins manage it all
from a dashboard.

**Stack:** Next.js 16 · Tailwind CSS v4 · Supabase (auth + database).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

The app runs immediately using built-in seed content. To enable saving (form
submissions, admin sign-in, live data) connect Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.local.example` to `.env.local` and fill in (Project Settings → API):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Create an admin user under **Authentication → Users**, then sign in at `/login`.

## Screens

| Route | Description |
| --- | --- |
| `/` | Portal home — hero, quick actions, latest updates, multimedia & participation hubs |
| `/events` | Community events with ticket booking + "suggest an event" |
| `/support` | Report a concern, send a compliment, easy-read policies, feedback |
| `/news` | Community news |
| `/admin` | Admin dashboard — stats, request inbox, safeguarding, content library (sign-in required) |

## Project layout

- `src/app` — routes · `src/components/chrome` — nav/layout · `src/components/screens`
  and `src/components/admin` — screen UIs
- `src/lib` — `types`, `seed`, `data`, `actions`, `supabase/*`, `env`
- `design-source/community-hub` — the original Stitch design (reference)
- `supabase/schema.sql` — database schema + row-level security

## Checks

```bash
npx tsc --noEmit && npm run lint && npm run build
```

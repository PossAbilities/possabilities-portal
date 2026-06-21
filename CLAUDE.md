# PossAbilities Portal

A web portal for the people that **PossAbilities** (UK charity) supports — the
"Community Hub" designed in Google Stitch ("Easy Read" philosophy, for adults with
learning disabilities). Built to match the design exactly, with every button/link
working and data in Supabase.

## Stack
- **Next.js 16** (App Router, TypeScript, `src/`, import alias `@/*`)
- **Tailwind CSS v4** — theme tokens in `globals.css` mirror the Stitch
  "PossAbilities Universal" design system (colours `brand-purple/pink/teal`, fonts
  Montserrat + Atkinson Hyperlegible Next, spacing `margin-side/gutter/stack-*`).
- **Supabase** for auth + data (`@supabase/ssr`).

## Screens (from design-source/community-hub)
- `/` — Portal Home (hero, quick actions, latest updates, multimedia hub, participation hub)
- `/events` — Community Events (event cards + ticket booking panel + suggest-an-event form)
- `/support` — Support & Resources (report concern, send compliment, policy library, feedback)
- `/news` — Community News listing
- `/admin` — Admin Dashboard (stats, Request Inbox, Safeguarding, Content Library) — auth-gated
- `/login` — admin sign-in (Supabase Auth)

## Chrome
`src/components/chrome/`: TopNav, Sidebar, MobileNav, Footer, Fab — rendered globally
in `app/layout.tsx`. Active states via `usePathname`.

## Data
- `src/lib/types.ts`, `seed.ts` (design content), `data.ts` (reads, seed fallback),
  `actions.ts` (`createRequest`, `updateRequestStatus`).
- Tables: `news_posts`, `events`, `policies`, `requests` (see `supabase/schema.sql`).
  The `requests` table is the live one — all public forms (suggest event, feedback,
  concern, compliment, ticket) write here; the admin inbox reads/updates it.
- `src/lib/supabase/*` clients + `src/proxy.ts` guard (public by default, `/admin/*`
  requires a signed-in user). `src/lib/env.ts#isSupabaseConfigured` gates the seed
  fallback so the app runs before real keys are added (`.env.local` has placeholders).

## Accessibility (non-negotiable)
Users have learning disabilities — target WCAG AA+: large touch targets (≥48px), high
contrast, plain language, 4px teal focus rings, semantic HTML.

## Conventions
- Server Components by default; `"use client"` only for forms/dialogs/nav.
- Match the design's Tailwind classes; the theme tokens make them resolve as designed.
- Run `npx tsc --noEmit`, `npm run lint`, `npm run build` before declaring done.

@AGENTS.md

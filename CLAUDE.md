# PossAbilities Support Portal

A web portal for the people that **PossAbilities** (UK charity) supports. Designed in
Google Stitch; being built to match those designs exactly, with every button/link working.

## Stack
- **Next.js 16** (App Router, TypeScript, `src/` dir, import alias `@/*`)
- **Tailwind CSS v4**
- **Supabase** for auth + database (`@supabase/ssr`, `@supabase/supabase-js`)

## Supabase clients (already scaffolded)
- `src/lib/supabase/client.ts` — browser (Client Components)
- `src/lib/supabase/server.ts` — Server Components / Route Handlers / Server Actions
- `src/lib/supabase/middleware.ts` + `src/middleware.ts` — session refresh + route guard
  - Public (unauthenticated) paths: `/login`, `/auth`, `/forgot-password`. Everything
    else redirects to `/login`. Update the allow-list as routes are added.

## Environment
- Real Supabase project is **not yet created**. `.env.local` holds placeholders so the
  app boots. Replace `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` with
  real values (Supabase → Project Settings → API) before auth/data work.

## Accessibility (non-negotiable)
PossAbilities supports people with disabilities and learning difficulties. Target
**WCAG 2.2 AA**: semantic HTML, visible focus states, labelled controls, large tap
targets (≥44px), plain language, strong colour contrast, keyboard navigable.

## Designs
Source of truth = the Stitch designs, accessed via the **stitch MCP** (server is
configured in local config). Match layout, colours, type, and spacing exactly.

## Build plan / next steps
1. Pull each screen from Stitch MCP; catalogue screens, components, design tokens.
2. Encode design tokens (colours, fonts, radii) into Tailwind theme + `globals.css`.
3. Build shared layout/nav, then each screen as a route. Wire all links/buttons.
4. Define the Supabase schema from the data each screen needs; enable RLS.
5. Implement auth (login / password reset) and connect screens to live data.

## Conventions
- Keep components in `src/components`, routes in `src/app`.
- Server Components by default; `"use client"` only when needed (forms, interactivity).
- Run `npx tsc --noEmit` and `npm run lint` before declaring work done.

@AGENTS.md

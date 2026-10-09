# PossAbilities Portal

Sign-in hub for the people PossAbilities supports: news, Easy Read, workshops, groups and videos.
Phone-first PWA. Magic-link sign-in (no passwords). Content syncs in from the Easy Read site,
the Workshops site and PossAbilities TV.

**Live:** https://portal.pixelhub.org.uk · **API:** https://portal-api.pixelhub.org.uk

## What's in the box

| Folder | What |
|---|---|
| `web/` | React + Vite + TypeScript + Tailwind PWA. Nunito Sans, Lucide icons, brand wave, people illustration. |
| `supabase/migrations/` | Schema (`0001`) and starter content (`0002`). Row-level security on every table. |
| `supabase/functions/sync-content/` | Edge function that pulls from the three source sites. Idempotent upserts. |
| `deploy/` | `setup.sh` (one-time VPS setup), Caddy block, frontend + nightly R2 backup compose, hourly cron SQL. |
| `.github/workflows/` | `checks.yml` (typecheck, build, audit on every PR) and `deploy.yml` (push to `main` = live). |

## How it works

- **Sign in:** person types their email, gets a link, taps it. Supabase Auth (GoTrue) sends the email through Resend SMTP.
  First sign-in auto-creates `profiles` and `user_settings` rows (trigger in `0001_schema.sql`).
- **Accessibility settings** (text size, colour theme, read aloud, pictures, less on screen) are applied instantly via
  CSS variables on `<html>` and saved to `user_settings`. Read-aloud uses the device's own voice (Web Speech API), no cost.
- **Colour per section:** Home/Videos purple, News pink, Learn teal, Groups lilac. Header, active tab and cards share it.
- **Sync:** `sync-content` runs hourly (pg_cron) and on demand (`POST /functions/v1/sync-content {"source":"easyread"}`
  with header `x-sync-secret`). Source sites can call that URL from a database webhook so new items appear within seconds.
  Each run is logged in `sync_runs`. Every row is upserted on `(source, source_id)` so re-runs never duplicate.
- **Roles:** `profiles.role` is `user` by default. Set `staff`/`admin` in the DB to let someone post to groups or edit content.

## Deploy to Ryan's Cloud (one time)

Follows the standard pattern: self-hosted Supabase stack mirrored from `/opt/easyread`, shared Caddy, R2 backups, Resend.

1. **Clone** into `C:\RyanCloud\portal` and push the repo to the PossAbilities GitHub org.
2. **Ship the source to the VPS and run setup** (PowerShell):
   ```powershell
   cd C:\RyanCloud\portal
   tar --exclude=node_modules --exclude=dist --exclude=.git -czf portal.tar.gz .
   scp portal.tar.gz root@178.104.251.61:/root/portal.tar.gz
   ssh root@178.104.251.61 "rm -rf /root/portal-src && mkdir -p /root/portal-src && tar xzf /root/portal.tar.gz -C /root/portal-src && cp /root/portal-src/deploy/setup.sh /root/portal-setup.sh && bash /root/portal-setup.sh"
   ```
   If your template Supabase site isn't `/opt/easyread`, edit `TEMPLATE=` at the top of `deploy/setup.sh` first.
3. **Fill the secrets** on the VPS (never in chat): `nano /opt/portal/.env`
   - `ANON_KEY` / `SERVICE_ROLE_KEY`: generate from the new `JWT_SECRET` (Supabase self-hosting docs, "Generate API keys").
   - `SMTP_PASS`: Resend API key. `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
   - `EASYREAD_API_KEY`, `WORKSHOPS_API_KEY`, `TV_API_KEY` and the table/column names (see `supabase/.env.example`).
   - `SYNC_SECRET`: any long random string.
   Then `nano /opt/portal/app/web/.env` and paste the `ANON_KEY`.
4. **Start and migrate:**
   ```powershell
   ssh root@178.104.251.61 "cd /opt/portal && docker compose up -d && sleep 20 && docker compose ps"
   ssh root@178.104.251.61 "docker exec -i portal-db psql -U postgres -d postgres < /opt/portal/app/supabase/migrations/0001_schema.sql"
   ssh root@178.104.251.61 "docker exec -i portal-db psql -U postgres -d postgres < /opt/portal/app/supabase/migrations/0002_seed.sql"
   ssh root@178.104.251.61 "cd /opt/portal && docker compose build portal-web && docker compose up -d portal-web"
   ```
5. **Caddy + DNS:** append `deploy/Caddyfile.portal` to `/opt/mhfa/Caddyfile`, then `docker restart mhfa-caddy`.
   Add two Cloudflare A records `portal` and `portal-api` → `178.104.251.61`, Proxied. Zone SSL = **Full** (not Strict).
   ```powershell
   ssh root@178.104.251.61 "cat /root/portal-src/deploy/Caddyfile.portal >> /opt/mhfa/Caddyfile && docker restart mhfa-caddy"
   ```
6. **Hourly sync:** edit the secret in `deploy/cron.sql`, then
   `ssh root@178.104.251.61 "docker exec -i portal-db psql -U postgres -d postgres < /opt/portal/app/deploy/cron.sql"`
7. **First backup by hand**, then check the object lands in `ryan-cloud-backups/portal/`:
   `ssh root@178.104.251.61 "docker exec portal-backup backup"`
8. **Push-to-deploy:** add repo secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (base64 of the private key). Pushes to `main` then rebuild the frontend and reload the sync function.
9. **Verify:** load the site, sign in with your own email, confirm the magic-link email arrives, open Settings and change the text size, run a manual sync:
   `curl -X POST https://portal-api.pixelhub.org.uk/functions/v1/sync-content -H "x-sync-secret: ..." -d '{"source":"all"}'`
10. Add the row to `C:\RyanCloud\RYAN-CLOUD-SITES.md`.

## Day-to-day

- Work on a branch, open a PR, let `checks.yml` plus CodeQL/Dependabot/secret scanning pass, merge → live.
- Give someone access: they just sign in with the email the team has for them. Staff can set `support_worker_email` on their profile.
- Add someone to a group: insert into `group_members`. Post to a group: insert into `group_posts` (staff role required via RLS).
- Local dev: `cd web && cp .env.example .env && npm i && npm run dev`.

## Still to confirm with Ryan

- Exact table and column names on the Easy Read and Workshops sites (set in `/opt/portal/.env`; the function doesn't change).
- How PossAbilities TV exposes `shows` (PostgREST or a feed). Set `TV_API_URL` or `TV_RSS_URL`.
- Real name of the LGBTQ+ group (currently a placeholder in `0002_seed.sql`).
- Billy: not included until there's a character sheet.

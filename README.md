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

Standard Ryan's Cloud pattern: self-hosted Supabase in Docker at `/opt/portal`, frontend container `portal-web`,
hostnames `portal.pixelhub.org.uk` and `portal-api.pixelhub.org.uk`, shared `mhfa-caddy`, nightly R2 backup, Resend email.
Every line below is pasted into **PowerShell** on Ryan's PC. Secrets are typed into `.env` on the VPS, never into chat.

### 1. Get the code
```powershell
cd C:\RyanCloud
git clone https://github.com/PossAbilities/possabilities-portal portal
cd C:\RyanCloud\portal
```

### 2. Ship it and run setup
```powershell
tar --exclude=node_modules --exclude=dist --exclude=.git -czf portal.tar.gz .
scp portal.tar.gz root@178.104.251.61:/root/portal.tar.gz
ssh root@178.104.251.61 "rm -rf /root/portal-src && mkdir -p /root/portal-src && tar xzf /root/portal.tar.gz -C /root/portal-src && cp /root/portal-src/deploy/setup.sh /root/portal-setup.sh && cp /root/portal-src/deploy/go-live.sh /root/portal-go-live.sh && bash /root/portal-setup.sh"
```
`setup.sh` mirrors the EasyRead Supabase layout into `/opt/portal`, renames containers, adds the frontend and backup
services, generates fresh `POSTGRES_PASSWORD` and `JWT_SECRET`, points SMTP at Resend and writes placeholder `.env` files.

### 3. Fill the secrets (on the VPS)
```powershell
ssh root@178.104.251.61
nano /opt/portal/.env
```
Fill every `PASTE_` value: `ANON_KEY` and `SERVICE_ROLE_KEY` (generate from the new `JWT_SECRET`:
https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys), `SMTP_PASS` (Resend API key),
`R2_ENDPOINT`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`, the Easy Read / Workshops / TV source URLs and keys, and a
random `SYNC_SECRET`. Then:
```powershell
nano /opt/portal/app/web/.env      # paste the same ANON_KEY
exit
```

### 4. Go live
```powershell
ssh root@178.104.251.61 "bash /root/portal-go-live.sh"
```
Starts the stack, runs migrations 0001–0003, builds `portal-web`, appends the Caddy block and restarts Caddy,
schedules the hourly sync, and runs the first backup. Check `ryan-cloud-backups/portal/` in R2 has an object.

### 5. DNS
Cloudflare → pixelhub.org.uk: two **A** records, `portal` and `portal-api`, → `178.104.251.61`, **Proxied**.
Zone SSL/TLS mode = **Full** (not Strict, not Automatic).

### 6. Verify live
Open https://portal.pixelhub.org.uk → enter your email → magic link arrives from Resend → signed in →
Settings: change text size → Learn: open an Easy Read, press Read to me → trigger a sync:
```powershell
curl -X POST https://portal-api.pixelhub.org.uk/functions/v1/sync-content -H "x-sync-secret: YOUR_SYNC_SECRET" -H "Content-Type: application/json" -d "{\"source\":\"all\"}"
```

### 7. Push-to-deploy
Generate a deploy key and add three GitHub secrets (Settings → Secrets and variables → Actions):
```powershell
ssh-keygen -t ed25519 -f $HOME\.ssh\portal_deploy -N '""' -C portal-deploy
type $HOME\.ssh\portal_deploy.pub | ssh root@178.104.251.61 "cat >> ~/.ssh/authorized_keys"
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\.ssh\portal_deploy")) | Set-Clipboard
```
`VPS_HOST` = `178.104.251.61` · `VPS_USER` = `root` · `VPS_SSH_KEY` = paste (the base64 is on your clipboard).
From then on, merging to `main` deploys. `.env` on the VPS is never touched by a deploy.

### 8. Register
Add to `C:\RyanCloud\RYAN-CLOUD-SITES.md`:

| Site | Source | Containers | Hostnames | Deploy |
|---|---|---|---|---|
| Portal (service users) | `C:\RyanCloud\portal` | `portal-db portal-kong portal-auth portal-rest portal-storage portal-imgproxy portal-meta portal-functions portal-web portal-backup` at `/opt/portal` | `portal.pixelhub.org.uk` → portal-web:80 · `portal-api.pixelhub.org.uk` → portal-kong:8000 | push to `main` (GitHub Actions) |

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

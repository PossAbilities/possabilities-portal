#!/usr/bin/env bash
# Second half of first deploy. Run on the VPS AFTER filling /opt/portal/.env and /opt/portal/app/web/.env:
#   bash /root/portal-go-live.sh
set -euo pipefail
cd /opt/portal
grep -q PASTE_ .env && { echo "Fill the PASTE_ values in /opt/portal/.env first"; exit 1; }
grep -q PASTE_ app/web/.env && { echo "Fill ANON_KEY in /opt/portal/app/web/.env first"; exit 1; }

echo "1) Start the stack"; docker compose up -d; sleep 25; docker compose ps
echo "2) Migrations"
for f in 0001_schema 0002_seed 0003_sounds_motion; do docker exec -i portal-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < app/supabase/migrations/$f.sql; done
echo "3) Frontend"; docker compose build portal-web && docker compose up -d portal-web
echo "4) Caddy"
grep -q 'portal.pixelhub.org.uk' /opt/mhfa/Caddyfile || cat app/deploy/Caddyfile.portal >> /opt/mhfa/Caddyfile
docker restart mhfa-caddy
echo "5) Hourly sync schedule"
SECRET=$(grep '^SYNC_SECRET=' .env | cut -d= -f2-)
sed "s/REPLACE_WITH_SYNC_SECRET/$SECRET/" app/deploy/cron.sql | docker exec -i portal-db psql -U postgres -d postgres -v ON_ERROR_STOP=1
echo "6) First backup by hand"; docker exec portal-backup backup && echo "   check ryan-cloud-backups/portal/ in R2"
echo; echo "DONE. Add the two Cloudflare A records (portal, portal-api -> 178.104.251.61, proxied), zone SSL = Full, then open https://portal.pixelhub.org.uk"

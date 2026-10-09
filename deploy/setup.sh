#!/usr/bin/env bash
# One-time setup of the portal on Ryan's Cloud. Run on the VPS:  bash /root/portal-setup.sh
# It mirrors an existing self-hosted Supabase site (easyread) so every site is laid out the same way.
set -euo pipefail
SITE=portal
TEMPLATE=/opt/easyread          # existing self-hosted Supabase site to mirror
DEST=/opt/$SITE

[ -d "$DEST" ] && { echo "$DEST already exists - stopping so nothing is overwritten"; exit 1; }
[ -d "$TEMPLATE" ] || { echo "Template $TEMPLATE not found. Set TEMPLATE to any existing supabase-* site folder."; exit 1; }

echo "1) Copy the Supabase stack layout (compose + kong config), not the data"
mkdir -p "$DEST"
cp "$TEMPLATE/docker-compose.yml" "$DEST/"
cp -r "$TEMPLATE/volumes" "$DEST/volumes"
rm -rf "$DEST/volumes/db/data" "$DEST/volumes/storage"/* 2>/dev/null || true
mkdir -p "$DEST/volumes/db/data" "$DEST/volumes/storage" "$DEST/volumes/functions/sync-content"
chmod -R a+rX "$DEST/volumes"   # known Kong gotcha: mounted-config perms

echo "2) Rename container names from the template site to $SITE"
sed -i "s/easyread-/$SITE-/g; s/easyread_/${SITE}_/g" "$DEST/docker-compose.yml"

echo "3) Frontend + backup services"
cat /root/portal-src/deploy/docker-compose.frontend.yml | sed '1,2d' | sed 's/^services://' >> "$DEST/docker-compose.yml"

echo "4) App code"
mkdir -p "$DEST/app" && cp -r /root/portal-src/. "$DEST/app/"
cp /root/portal-src/supabase/functions/sync-content/index.ts "$DEST/volumes/functions/sync-content/index.ts"

echo "5) Fresh secrets (.env). Paste real values in afterwards - nothing secret is generated into chat."
cp "$TEMPLATE/.env" "$DEST/.env"
JWT=$(openssl rand -hex 32); PG=$(openssl rand -hex 24)
sed -i "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$PG/; s/^JWT_SECRET=.*/JWT_SECRET=$JWT/" "$DEST/.env"
sed -i "s#^SITE_URL=.*#SITE_URL=https://portal.pixelhub.org.uk#; s#^API_EXTERNAL_URL=.*#API_EXTERNAL_URL=https://portal-api.pixelhub.org.uk#; s#^SUPABASE_PUBLIC_URL=.*#SUPABASE_PUBLIC_URL=https://portal-api.pixelhub.org.uk#" "$DEST/.env"
echo "   !! ANON_KEY and SERVICE_ROLE_KEY must be regenerated from the new JWT_SECRET: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys"
cat /root/portal-src/supabase/.env.example >> "$DEST/.env"

echo "6) Magic-link email via Resend (SMTP)"
sed -i "s/^SMTP_HOST=.*/SMTP_HOST=smtp.resend.com/; s/^SMTP_PORT=.*/SMTP_PORT=465/; s/^SMTP_USER=.*/SMTP_USER=resend/; s/^SMTP_SENDER_NAME=.*/SMTP_SENDER_NAME=PossAbilities Portal/; s/^SMTP_ADMIN_EMAIL=.*/SMTP_ADMIN_EMAIL=portal@possabilities.org.uk/" "$DEST/.env"
grep -q '^SMTP_PASS=' "$DEST/.env" && sed -i "s/^SMTP_PASS=.*/SMTP_PASS=PASTE_RESEND_API_KEY/" "$DEST/.env"
grep -q '^MAILER_URLPATHS_' "$DEST/.env" || echo 'MAILER_URLPATHS_CONFIRMATION=/auth/v1/verify' >> "$DEST/.env"
echo 'GOTRUE_EXTERNAL_EMAIL_ENABLED=true' >> "$DEST/.env"; echo 'GOTRUE_MAILER_AUTOCONFIRM=false' >> "$DEST/.env"

echo "7) Frontend env"
printf 'VITE_SUPABASE_URL=https://portal-api.pixelhub.org.uk\nVITE_SUPABASE_ANON_KEY=PASTE_ANON_KEY\n' > "$DEST/app/web/.env"

echo
echo "DONE. Next, by hand:"
echo "  a) nano $DEST/.env  -> fill ANON_KEY, SERVICE_ROLE_KEY, SMTP_PASS (Resend key), R2_*, EASYREAD/WORKSHOPS/TV keys, SYNC_SECRET"
echo "  b) nano $DEST/app/web/.env -> paste ANON_KEY"
echo "  c) cd $DEST && docker compose up -d && docker compose ps"
echo "  d) run the migrations:  docker exec -i ${SITE}-db psql -U postgres -d postgres < $DEST/app/supabase/migrations/0001_schema.sql"
echo "                          docker exec -i ${SITE}-db psql -U postgres -d postgres < $DEST/app/supabase/migrations/0002_seed.sql"
echo "  e) cd $DEST && docker compose build portal-web && docker compose up -d portal-web"
echo "  f) cat /root/portal-src/deploy/Caddyfile.portal >> /opt/mhfa/Caddyfile && docker restart mhfa-caddy"

-- Hourly sync (pg_cron + pg_net are in the self-hosted stack). Replace the secret to match SYNC_SECRET in .env.
create extension if not exists pg_cron; create extension if not exists pg_net;
select cron.schedule('portal-sync-content', '7 * * * *', $$
  select net.http_post(
    url := 'http://functions:9000/sync-content',
    headers := '{"Content-Type":"application/json","x-sync-secret":"REPLACE_WITH_SYNC_SECRET"}'::jsonb,
    body := '{"source":"all"}'::jsonb);
$$);

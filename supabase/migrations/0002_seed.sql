-- Starter content so the portal isn't empty on day one. Safe to re-run.
insert into public.groups (slug, name, description, colour, next_meetup_at) values
 ('possabilities-together','PossAbilities Together','Our biggest group. Everyone is welcome.','purple', now() + interval '6 days'),
 ('lgbtq','LGBTQ+ Group','A friendly group for LGBTQ+ people we support.','pink', null)
on conflict (slug) do nothing;

insert into public.easy_read_docs (source, source_id, title, category, steps) values
 ('manual','tv-tablet-guide','How to watch PossAbilities TV on your tablet','Guides',
  '[{"text":"Open the app store on your tablet.","icon":"tablet"},{"text":"Search for PossAbilities TV.","icon":"search"},{"text":"Tap Get. Wait a little while.","icon":"download"},{"text":"Open the app. Sign in.","icon":"log-in"},{"text":"Press play. Enjoy!","icon":"play"}]'::jsonb)
on conflict (source, source_id) do nothing;

insert into public.workshops (source, source_id, title, summary, next_session_at) values
 ('manual','small-changes','Small Changes, Big Difference','The Environment workshop: little things we can all do.', now() + interval '2 days')
on conflict (source, source_id) do nothing;
insert into public.workshop_steps (workshop_id, position, title, subtitle, kind)
select w.id, s.position, s.title, s.subtitle, s.kind from public.workshops w,
 (values (1,'The Environment slides','Go through these together','slides'),(2,'Why small changes matter','4 minutes','video'),(3,'Recycling at home','3 minutes','video'),(4,'Your workbook','Follow along and keep it','workbook'),(5,'Small changes at home','Simple words and pictures','easyread')) as s(position,title,subtitle,kind)
where w.source_id = 'small-changes' on conflict (workshop_id, position) do nothing;

insert into public.news_posts (source, source_id, title, summary, body_easy, read_minutes) values
 ('manual','yourgo-launch',E'It''s YourGo! See how the launch day went','YourGo launched this month. Lots of people came to our launch day.',E'YourGo launched this month. Lots of people came to our launch day.\n\nWe made a short film about it. You can watch it in Videos.',2),
 ('manual','tv-tablet','PossAbilities TV is on your tablet','You can now watch PossAbilities TV on your tablet.',E'You can now watch PossAbilities TV on your tablet.\n\nThere is an Easy Read guide that shows you how, one step at a time.',2)
on conflict (source, source_id) do nothing;
update public.news_posts n set easy_read_doc_id = d.id from public.easy_read_docs d where n.source_id='tv-tablet' and d.source_id='tv-tablet-guide';

insert into public.videos (source, source_id, title, description) values
 ('manual','dont-stop-me-now',E'Don''t Stop Me Now','Our film about the people we support.'),
 ('manual','welcome','Welcome to your portal','A short tour of what you can do here.')
on conflict (source, source_id) do nothing;

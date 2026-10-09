// Supabase Edge Function: sync-content
// Pulls new items from the Easy Read site, the Workshops site and PossAbilities TV into the portal.
// Runs on a schedule (pg_cron or n8n) and can also be hit by a webhook from a source site:
//   POST /functions/v1/sync-content  { "source": "easyread" | "workshops" | "tv" | "all" }
//   Header: x-sync-secret: $SYNC_SECRET
// Every write is an upsert on (source, source_id), so re-running is safe and never duplicates.
//
// Field mapping is config-driven (see FIELD MAPS below). Column names on the source sites are set via env
// so this file doesn't change when you confirm their schemas.

import { createClient } from 'npm:@supabase/supabase-js@2'

const env = (k: string, d = '') => Deno.env.get(k) ?? d
const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })

type Row = Record<string, unknown>
async function restFetch(baseUrl: string, apiKey: string, table: string, sinceCol: string, since: string | null, select = '*'): Promise<Row[]> {
  const u = new URL(`${baseUrl.replace(/\/$/, '')}/rest/v1/${table}`)
  u.searchParams.set('select', select); u.searchParams.set('order', `${sinceCol}.desc`); u.searchParams.set('limit', '200')
  if (since) u.searchParams.set(sinceCol, `gt.${since}`)
  const r = await fetch(u, { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } })
  if (!r.ok) throw new Error(`${table}: ${r.status} ${await r.text()}`)
  return await r.json()
}
async function rssFetch(url: string): Promise<Row[]> {
  const xml = await (await fetch(url)).text()
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1])
  const tag = (s: string, t: string) => (s.match(new RegExp(`<${t}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${t}>`)) ?? [])[1]?.trim() ?? null
  return items.map(i => ({ guid: tag(i, 'guid') ?? tag(i, 'link'), title: tag(i, 'title'), description: tag(i, 'description'), link: tag(i, 'link'), pubDate: tag(i, 'pubDate'), enclosure: (i.match(/<enclosure[^>]*url="([^"]+)"/) ?? [])[1] ?? null }))
}
const str = (v: unknown) => (v == null ? null : String(v))
const iso = (v: unknown) => (v ? new Date(String(v)).toISOString() : new Date().toISOString())
async function lastSync(source: string) {
  const { data } = await admin.from('sync_runs').select('finished_at').eq('source', source).eq('status', 'ok').order('finished_at', { ascending: false }).limit(1).maybeSingle()
  return data?.finished_at ?? null
}

// ---------- FIELD MAPS (edit env, not code) ----------
// Easy Read site (self-hosted Supabase). Expected: a documents table with a title, a category, and either a JSON
// array of steps or a plain body that we split into one step per paragraph.
async function syncEasyRead(since: string | null) {
  if (env('EASYREAD_RSS_URL')) return syncRss('easyread', env('EASYREAD_RSS_URL'), 'easy_read_docs')
  const rows = await restFetch(env('EASYREAD_API_URL'), env('EASYREAD_API_KEY'), env('EASYREAD_TABLE', 'documents'), env('EASYREAD_UPDATED_COL', 'updated_at'), since)
  const f = { id: env('EASYREAD_ID_COL', 'id'), title: env('EASYREAD_TITLE_COL', 'title'), cat: env('EASYREAD_CATEGORY_COL', 'category'), steps: env('EASYREAD_STEPS_COL', 'steps'), body: env('EASYREAD_BODY_COL', 'body'), audio: env('EASYREAD_AUDIO_COL', 'audio_url'), url: env('EASYREAD_URL_COL', 'public_url'), pub: env('EASYREAD_PUBLISHED_COL', 'published_at'), published: env('EASYREAD_PUBLISHED_FLAG_COL', '') }
  const docs = rows.filter(r => !f.published || r[f.published] === true).map(r => {
    let steps = r[f.steps]
    if (typeof steps === 'string') { try { steps = JSON.parse(steps) } catch { steps = null } }
    if (!Array.isArray(steps)) steps = String(r[f.body] ?? '').split(/\n{2,}/).filter(Boolean).map(text => ({ text }))
    return { source: 'easyread', source_id: str(r[f.id]), title: str(r[f.title]) ?? 'Untitled', category: str(r[f.cat]), steps, audio_url: str(r[f.audio]), source_url: str(r[f.url]), published_at: iso(r[f.pub]), updated_at: new Date().toISOString() }
  })
  if (docs.length) { const { error } = await admin.from('easy_read_docs').upsert(docs, { onConflict: 'source,source_id' }); if (error) throw error }
  return docs.length
}
// Workshops site. Expected: a workshops table (title, summary, next session) plus a steps/resources table keyed by workshop id.
async function syncWorkshops(since: string | null) {
  const base = env('WORKSHOPS_API_URL'), key = env('WORKSHOPS_API_KEY')
  const rows = await restFetch(base, key, env('WORKSHOPS_TABLE', 'workshops'), env('WORKSHOPS_UPDATED_COL', 'updated_at'), since)
  const f = { id: env('WORKSHOPS_ID_COL', 'id'), title: env('WORKSHOPS_TITLE_COL', 'title'), sum: env('WORKSHOPS_SUMMARY_COL', 'summary'), next: env('WORKSHOPS_NEXT_COL', 'next_session_at'), cover: env('WORKSHOPS_COVER_COL', 'cover_url'), pub: env('WORKSHOPS_PUBLISHED_COL', 'created_at') }
  let n = 0
  for (const r of rows) {
    const { data: w, error } = await admin.from('workshops').upsert({ source: 'workshops', source_id: str(r[f.id]), title: str(r[f.title]) ?? 'Workshop', summary: str(r[f.sum]), next_session_at: r[f.next] ? iso(r[f.next]) : null, cover_url: str(r[f.cover]), published_at: iso(r[f.pub]), updated_at: new Date().toISOString() }, { onConflict: 'source,source_id' }).select('id').single()
    if (error) throw error; n++
    // steps: optional second table. Columns: workshop_id, position, title, subtitle, kind, url
    const stepsTable = env('WORKSHOPS_STEPS_TABLE', '')
    if (stepsTable) {
      const u = new URL(`${base.replace(/\/$/, '')}/rest/v1/${stepsTable}`); u.searchParams.set(env('WORKSHOPS_STEPS_FK_COL', 'workshop_id'), `eq.${r[f.id]}`); u.searchParams.set('order', 'position.asc')
      const steps: Row[] = await (await fetch(u, { headers: { apikey: key, Authorization: `Bearer ${key}` } })).json()
      const mapped = steps.map((s, i) => ({ workshop_id: w.id, source_id: str(s.id), position: Number(s.position ?? i + 1), title: str(s.title) ?? `Step ${i + 1}`, subtitle: str(s.subtitle), kind: (['workbook', 'slides', 'easyread', 'video', 'session'].includes(String(s.kind)) ? String(s.kind) : 'workbook'), resource_url: str(s.url ?? s.resource_url) }))
      if (mapped.length) { const { error: e2 } = await admin.from('workshop_steps').upsert(mapped, { onConflict: 'workshop_id,position' }); if (e2) throw e2 }
    }
  }
  return n
}
// PossAbilities TV: Postgres `shows` table exposed via PostgREST (or an RSS/JSON feed).
async function syncTv(since: string | null) {
  if (env('TV_RSS_URL')) return syncRss('tv', env('TV_RSS_URL'), 'videos')
  const rows = await restFetch(env('TV_API_URL'), env('TV_API_KEY'), env('TV_TABLE', 'shows'), env('TV_UPDATED_COL', 'updated_at'), since)
  const f = { id: env('TV_ID_COL', 'id'), title: env('TV_TITLE_COL', 'title'), desc: env('TV_DESC_COL', 'description'), play: env('TV_PLAYBACK_COL', 'playback_url'), poster: env('TV_POSTER_COL', 'poster_url'), cc: env('TV_CAPTIONS_COL', 'captions_url'), dur: env('TV_DURATION_COL', 'duration_s'), pub: env('TV_PUBLISHED_COL', 'published_at'), flag: env('TV_PUBLISHED_FLAG_COL', '') }
  const vids = rows.filter(r => !f.flag || r[f.flag] === true).map(r => ({ source: 'tv', source_id: str(r[f.id]), title: str(r[f.title]) ?? 'Video', description: str(r[f.desc]), playback_url: str(r[f.play]), poster_url: str(r[f.poster]), captions_url: str(r[f.cc]), duration_s: r[f.dur] ? Number(r[f.dur]) : null, published_at: iso(r[f.pub]), updated_at: new Date().toISOString() }))
  if (vids.length) { const { error } = await admin.from('videos').upsert(vids, { onConflict: 'source,source_id' }); if (error) throw error }
  return vids.length
}
async function syncRss(source: string, url: string, table: 'easy_read_docs' | 'videos' | 'news_posts') {
  const items = await rssFetch(url)
  const rows = items.map(i => table === 'videos'
    ? { source, source_id: i.guid, title: i.title, description: i.description, playback_url: i.enclosure ?? i.link, published_at: iso(i.pubDate), updated_at: new Date().toISOString() }
    : table === 'easy_read_docs'
      ? { source, source_id: i.guid, title: i.title, steps: String(i.description ?? '').replace(/<[^>]+>/g, '').split(/\n{2,}/).filter(Boolean).map(text => ({ text })), source_url: i.link, published_at: iso(i.pubDate), updated_at: new Date().toISOString() }
      : { source, source_id: i.guid, title: i.title, summary: String(i.description ?? '').replace(/<[^>]+>/g, ''), image_url: i.enclosure, published_at: iso(i.pubDate), updated_at: new Date().toISOString() })
  if (rows.length) { const { error } = await admin.from(table).upsert(rows, { onConflict: 'source,source_id' }); if (error) throw error }
  return rows.length
}
// Any new Easy Read doc also becomes a news post so it shows up in "New this week".
async function mirrorEasyReadToNews() {
  const { data } = await admin.from('easy_read_docs').select('id,title,category,published_at').eq('source', 'easyread')
  const rows = (data ?? []).map(d => ({ source: 'easyread', source_id: d.id, title: d.title, summary: d.category ? `New Easy Read: ${d.category}` : 'New Easy Read document', easy_read_doc_id: d.id, read_minutes: 2, published_at: d.published_at }))
  if (rows.length) await admin.from('news_posts').upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
}

const RUNNERS: Record<string, (since: string | null) => Promise<number>> = { easyread: syncEasyRead, workshops: syncWorkshops, tv: syncTv }

Deno.serve(async req => {
  if (env('SYNC_SECRET') && req.headers.get('x-sync-secret') !== env('SYNC_SECRET')) return new Response('forbidden', { status: 403 })
  let source = 'all'
  try { source = (await req.json()).source ?? 'all' } catch { /* GET or empty body = all */ }
  const which = source === 'all' ? Object.keys(RUNNERS) : [source]
  const results: Record<string, unknown> = {}
  for (const s of which) {
    if (!RUNNERS[s]) { results[s] = 'unknown source'; continue }
    const { data: run } = await admin.from('sync_runs').insert({ source: s }).select('id').single()
    try {
      const n = await RUNNERS[s](await lastSync(s))
      if (s === 'easyread') await mirrorEasyReadToNews()
      await admin.from('sync_runs').update({ finished_at: new Date().toISOString(), items: n, status: 'ok' }).eq('id', run!.id)
      results[s] = { items: n }
    } catch (e) {
      await admin.from('sync_runs').update({ finished_at: new Date().toISOString(), status: 'error', error: String(e) }).eq('id', run!.id)
      results[s] = { error: String(e) }
    }
  }
  return Response.json(results)
})

import { supabase } from './supabase'
import type { EasyReadDoc, Group, GroupPost, NewsPost, Video, Workshop, WorkshopStep } from './types'

export async function fetchNews(limit = 20) {
  const { data } = await supabase.from('news_posts').select('*').order('published_at', { ascending: false }).limit(limit)
  return (data ?? []) as NewsPost[]
}
export async function fetchNewsOne(id: string) {
  const { data } = await supabase.from('news_posts').select('*').eq('id', id).maybeSingle(); return data as NewsPost | null
}
export async function fetchEasyRead(limit = 20) {
  const { data } = await supabase.from('easy_read_docs').select('*').order('published_at', { ascending: false }).limit(limit)
  return (data ?? []) as EasyReadDoc[]
}
export async function fetchEasyReadOne(id: string) {
  const { data } = await supabase.from('easy_read_docs').select('*').eq('id', id).maybeSingle(); return data as EasyReadDoc | null
}
export async function fetchWorkshops(userId?: string) {
  const { data: ws } = await supabase.from('workshops').select('*, workshop_steps(*)').order('published_at', { ascending: false })
  const list = (ws ?? []) as (Workshop & { workshop_steps: WorkshopStep[] })[]
  let doneIds = new Set<string>()
  if (userId) {
    const { data: pr } = await supabase.from('workshop_progress').select('step_id').eq('user_id', userId)
    doneIds = new Set((pr ?? []).map((r: { step_id: string }) => r.step_id))
  }
  return list.map(w => ({ ...w, steps: [...w.workshop_steps].sort((a, b) => a.position - b.position), done: doneIds }))
}
export async function markStepDone(userId: string, stepId: string) {
  await supabase.from('workshop_progress').upsert({ user_id: userId, step_id: stepId })
}
export async function fetchVideos(limit = 20) {
  const { data } = await supabase.from('videos').select('*').order('published_at', { ascending: false }).limit(limit)
  return (data ?? []) as Video[]
}
export async function fetchGroups(userId?: string) {
  const { data: gs } = await supabase.from('groups').select('*').order('name')
  const groups = (gs ?? []) as Group[]
  if (!userId) return groups
  const { data: mem } = await supabase.from('group_members').select('group_id').eq('user_id', userId)
  const mine = new Set((mem ?? []).map((m: { group_id: string }) => m.group_id))
  const { data: posts } = await supabase.from('group_posts').select('*').order('created_at', { ascending: false }).limit(50)
  const latest = new Map<string, GroupPost>()
  for (const p of (posts ?? []) as GroupPost[]) if (!latest.has(p.group_id)) latest.set(p.group_id, p)
  return groups.map(g => ({ ...g, member: mine.has(g.id), latest: latest.get(g.id) ?? null }))
}
/** Count of items published since the person last opened the portal. Drives "3 new things for you". */
export async function countNewSince(iso: string | null) {
  if (!iso) return 0
  const tables = ['news_posts', 'easy_read_docs', 'videos', 'workshops'] as const
  const counts = await Promise.all(tables.map(t => supabase.from(t).select('id', { count: 'exact', head: true }).gt('published_at', iso)))
  return counts.reduce((n, c) => n + (c.count ?? 0), 0)
}

/** Calendar moments staff have added (see greeter.ts for the built-in ones). */
export async function fetchMoments() {
  const { data } = await supabase.from('moments').select('*')
  return ((data ?? []) as { from_md: string; to_md: string; character: string; pose: string | null; line: string }[])
    .map(m => ({ from: m.from_md, to: m.to_md, name: m.character as import('../illustrations/Character').CharacterName, pose: m.pose ?? undefined, line: m.line }))
}

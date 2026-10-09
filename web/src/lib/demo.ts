/**
 * Demo mode: a tiny in-memory stand-in for the Supabase client, used when VITE_DEMO=1.
 * Lets the app run with no backend (preview links, design reviews). Mirrors supabase/migrations/0002_seed.sql.
 * Only the query shapes used in data.ts and AppContext.tsx are implemented.
 */
const day = 86_400_000
const ago = (d: number) => new Date(Date.now() - d * day).toISOString()
const ahead = (d: number) => new Date(Date.now() + d * day).toISOString()

const USER = { id: 'demo-user', email: 'demo@possabilities.org.uk' }
const SESSION = { user: USER, access_token: 'demo', token_type: 'bearer', expires_in: 3600, refresh_token: 'demo' }

const tables: Record<string, Record<string, unknown>[]> = {
  profiles: [{ id: USER.id, first_name: 'Sam', display_name: 'Sam', role: 'user', last_seen_at: ago(3) }],
  user_settings: [],
  moments: [],
  groups: [
    { id: 'g1', slug: 'possabilities-together', name: 'PossAbilities Together', description: 'Our biggest group. Everyone is welcome.', colour: 'purple', next_meetup_at: ahead(6) },
    { id: 'g2', slug: 'lgbtq', name: 'LGBTQ+ Group', description: 'A friendly group for LGBTQ+ people we support.', colour: 'pink', next_meetup_at: null },
  ],
  group_members: [{ user_id: USER.id, group_id: 'g1' }],
  group_posts: [
    { id: 'p1', group_id: 'g1', title: 'Photos from the summer picnic', body: 'What a lovely day. Thank you to everyone who came.', image_url: null, created_at: ago(1) },
  ],
  easy_read_docs: [
    { id: 'e1', title: 'How to watch PossAbilities TV on your tablet', category: 'Guides', audio_url: null, published_at: ago(2),
      steps: [
        { text: 'Open the app store on your tablet.', icon: 'tablet' }, { text: 'Search for PossAbilities TV.', icon: 'search' },
        { text: 'Tap Get. Wait a little while.', icon: 'download' }, { text: 'Open the app. Sign in.', icon: 'log-in' }, { text: 'Press play. Enjoy!', icon: 'play' },
      ] },
    { id: 'e2', title: 'Small changes at home that help the planet', category: 'Environment', audio_url: null, published_at: ago(5),
      steps: [
        { text: 'Turn lights off when you leave a room.', icon: 'lightbulb' }, { text: 'Put paper and tins in the recycling bin.', icon: 'recycle' },
        { text: 'Fill the kettle with just the water you need.', icon: 'coffee' }, { text: 'Walk for short trips if you can.', icon: 'footprints' },
      ] },
  ],
  workshops: [
    { id: 'w1', title: 'Small Changes, Big Difference', summary: 'The Environment workshop: little things we can all do.', next_session_at: ahead(2), cover_url: null, published_at: ago(10) },
  ],
  workshop_steps: [
    { id: 's1', workshop_id: 'w1', position: 1, title: 'The Environment slides', subtitle: 'Go through these together', kind: 'slides', resource_url: 'https://example.org/slides' },
    { id: 's2', workshop_id: 'w1', position: 2, title: 'Why small changes matter', subtitle: '4 minutes', kind: 'video', resource_url: 'https://example.org/video1' },
    { id: 's3', workshop_id: 'w1', position: 3, title: 'Recycling at home', subtitle: '3 minutes', kind: 'video', resource_url: 'https://example.org/video2' },
    { id: 's4', workshop_id: 'w1', position: 4, title: 'Your workbook', subtitle: 'Follow along and keep it', kind: 'workbook', resource_url: 'https://example.org/workbook.pdf' },
    { id: 's5', workshop_id: 'w1', position: 5, title: 'Small changes at home', subtitle: 'Simple words and pictures', kind: 'easyread', resource_url: '/learn/read/e2' },
  ],
  workshop_progress: [{ user_id: USER.id, step_id: 's1' }],
  news_posts: [
    { id: 'n1', title: "It's YourGo! See how the launch day went", summary: 'YourGo launched this month. Lots of people came to our launch day.', body_easy: 'YourGo launched this month. Lots of people came to our launch day.\n\nWe made a short film about it. You can watch it in Videos.', image_url: null, audio_url: null, published_at: ago(1), read_minutes: 2, easy_read_doc_id: null },
    { id: 'n2', title: 'PossAbilities TV is on your tablet', summary: 'You can now watch PossAbilities TV on your tablet.', body_easy: 'You can now watch PossAbilities TV on your tablet.\n\nThere is an Easy Read guide that shows you how, one step at a time.', image_url: null, audio_url: null, published_at: ago(2), read_minutes: 2, easy_read_doc_id: 'e1' },
    { id: 'n3', title: 'Small changes at home that help the planet', summary: 'A new Easy Read from the Environment workshop.', body_easy: 'A new Easy Read from the Environment workshop.\n\nIt has four small things you can try at home this week.', image_url: null, audio_url: null, published_at: ago(5), read_minutes: 1, easy_read_doc_id: 'e2' },
  ],
  videos: [
    { id: 'v1', title: "Don't Stop Me Now", description: 'Our film about the people we support.', playback_url: null, poster_url: null, captions_url: null, published_at: ago(1) },
    { id: 'v2', title: 'Welcome to your portal', description: 'A short tour of what you can do here.', playback_url: null, poster_url: null, captions_url: null, published_at: ago(8) },
  ],
}

type Row = Record<string, unknown>
type Filter = (r: Row) => boolean

/** Chainable, awaitable query. Resolves to { data, count, error: null } like PostgREST. */
class Query {
  private filters: Filter[] = []
  private orderBy: { col: string; asc: boolean } | null = null
  private limitN: number | null = null
  private single = false
  private head = false
  private embed: string[] = []
  constructor(private table: string) {}
  select(cols = '*', opts?: { count?: string; head?: boolean }) {
    this.head = !!opts?.head
    for (const m of cols.matchAll(/(\w+)\(\*\)/g)) this.embed.push(m[1])
    return this
  }
  eq(col: string, v: unknown) { this.filters.push(r => r[col] === v); return this }
  gt(col: string, v: string) { this.filters.push(r => String(r[col]) > v); return this }
  order(col: string, o?: { ascending?: boolean }) { this.orderBy = { col, asc: o?.ascending ?? true }; return this }
  limit(n: number) { this.limitN = n; return this }
  maybeSingle() { this.single = true; return this }
  upsert(row: Row) {
    const t = tables[this.table]
    const keys = Object.keys(row).filter(k => k.endsWith('_id') || k === 'id')
    const i = t.findIndex(r => keys.every(k => r[k] === row[k]))
    if (i >= 0) t[i] = { ...t[i], ...row }; else t.push(row)
    return this
  }
  update(patch: Row) { this.filters.push(r => { Object.assign(r, patch); return true }); return this }
  private run() {
    let rows = tables[this.table].filter(r => this.filters.every(f => f(r))).map(r => ({ ...r }))
    if (this.orderBy) { const { col, asc } = this.orderBy; rows = [...rows].sort((a, b) => (String(a[col]) < String(b[col]) ? -1 : 1) * (asc ? 1 : -1)) }
    if (this.limitN != null) rows = rows.slice(0, this.limitN)
    if (this.embed.length) rows = rows.map(r => ({ ...r, ...Object.fromEntries(this.embed.map(e => [e, tables[e].filter(x => x[this.table.replace(/s$/, '') + '_id'] === r.id)])) }))
    const count = rows.length
    const data = this.head ? null : this.single ? rows[0] ?? null : rows
    return { data, count, error: null }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then(onfulfilled?: ((v: { data: any; count: number | null; error: null }) => any) | null, onrejected?: ((e: unknown) => any) | null) { return Promise.resolve(this.run()).then(onfulfilled, onrejected) }
}

const listeners = new Set<(e: string, s: typeof SESSION | null) => void>()
let signedIn = true

export const demoClient = {
  from: (table: string) => new Query(table),
  auth: {
    getSession: async () => ({ data: { session: signedIn ? SESSION : null } }),
    onAuthStateChange: (cb: (e: string, s: typeof SESSION | null) => void) => { listeners.add(cb); return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } } },
    signInWithOtp: async () => { signedIn = true; listeners.forEach(l => l('SIGNED_IN', SESSION)); return { error: null } },
    signOut: async () => { signedIn = false; listeners.forEach(l => l('SIGNED_OUT', null)); return { error: null } },
  },
}

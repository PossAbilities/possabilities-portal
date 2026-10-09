import type { CharacterName } from '../illustrations/Character'

/** One character meets you on Home. It rotates each visit; a calendar "moment" can take over for a day or a week. */
export type Greeter = { name: CharacterName; pose?: string; line?: string }

const ROTA: Greeter[] = [{ name: 'billy' }, { name: 'orla' }, { name: 'luca' }, { name: 'eliza' }, { name: 'nadia' }]

/** Built-in moments. Month/day, inclusive. Staff can add more in the `moments` table; those win over these. */
export type Moment = { from: string; to: string; name: CharacterName; pose?: string; line: string }
export const BUILT_IN_MOMENTS: Moment[] = [
  { from: '10-10', to: '10-10', name: 'nadia', pose: 'care',      line: "It's World Mental Health Day. Be kind to yourself today." },
  { from: '06-15', to: '06-21', name: 'luca',  pose: 'proud',     line: "It's Learning Disability Week." },
  { from: '06-01', to: '06-30', name: 'orla',  pose: 'pride',     line: 'Happy Pride month!' },
  { from: '12-18', to: '12-26', name: 'billy', pose: 'festive',   line: 'Merry Christmas from everyone at PossAbilities.' },
  { from: '12-31', to: '01-01', name: 'eliza', pose: 'party',     line: 'Happy New Year!' },
]

function mmdd(d: Date) { return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
function inRange(today: string, from: string, to: string) { return from <= to ? today >= from && today <= to : today >= from || today <= to }

export function pickGreeter(moments: Moment[] = [], now = new Date()): Greeter {
  const today = mmdd(now)
  const m = [...moments, ...BUILT_IN_MOMENTS].find(x => inRange(today, x.from, x.to))
  if (m) return { name: m.name, pose: m.pose, line: m.line }
  let i = 0
  try { i = (Number(localStorage.getItem('pa-greeter') ?? -1) + 1) % ROTA.length; localStorage.setItem('pa-greeter', String(i)) } catch { i = now.getDate() % ROTA.length }
  return ROTA[i]
}

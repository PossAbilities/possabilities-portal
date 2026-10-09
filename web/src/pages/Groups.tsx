import { useEffect, useState } from 'react'
import { CalendarDays, Users, HeartHandshake, ChevronRight } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { fetchGroups } from '../lib/data'
import type { Group } from '../lib/types'
import { whenShort } from '../lib/format'
import { Shell, Main } from '../components/Shell'
import { SectionHeader } from '../components/SectionHeader'
import { Hero } from '../illustrations/Hero'

const COL: Record<Group['colour'], { bg: string; fg: string }> = {
  purple: { bg: 'var(--purple)', fg: '#fff' }, pink: { bg: 'var(--tint-pink)', fg: 'var(--purple)' }, teal: { bg: 'var(--tint-teal)', fg: 'var(--purple)' }, lilac: { bg: 'var(--lilac)', fg: 'var(--purple)' },
}
export function Groups() {
  const { session } = useApp(); const [gs, setGs] = useState<Group[]>([])
  useEffect(() => { fetchGroups(session?.user.id).then(setGs) }, [session])
  const [hero, ...rest] = gs
  return (
    <Shell>
      <SectionHeader section="groups" title="Groups" />
      <Main>
        {hero && (
          <a href={`#group-${hero.slug}`} className="card overflow-hidden flex flex-col" style={{ background: 'var(--purple)', color: '#fff' }}>
            <div className="px-5 pt-5">
              <h2 className="h-display m-0 text-[1.9rem] md:text-[2.4rem]">{hero.name}</h2>
              {hero.next_meetup_at && <p className="m-0 mt-2 flex items-center gap-2 font-bold" style={{ color: 'var(--teal)' }}><CalendarDays size={20} strokeWidth={2.4} />Next meet-up: {whenShort(hero.next_meetup_at)}</p>}
            </div>
            <div className="h-[150px] md:h-[200px] relative"><div className="absolute inset-0 px-6"><Hero pose="leaning-in" /></div></div>
          </a>
        )}
        <ul className="list-none m-0 p-0 flex flex-col gap-4 md:grid md:grid-cols-2">
          {rest.map(g => {
            const c = COL[g.colour] ?? COL.lilac
            return (
              <li key={g.id}><a id={`group-${g.slug}`} href={`#group-${g.slug}`} className="card p-4 flex items-center gap-4" style={{ background: c.bg, color: c.fg }}>
                <span className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-none" style={{ background: 'var(--pink)', color: '#fff' }}><Users size={30} strokeWidth={2.3} /></span>
                <span className="flex-1 min-w-0"><span className="block h-display text-[1.35rem]">{g.name}</span><span className="block font-bold mt-1 hide-when-simple">{g.latest ? `Latest: ${g.latest.title}` : g.description ?? ''}</span></span>
                <ChevronRight size={26} strokeWidth={2.6} />
              </a></li>
            )
          })}
          <li><div className="card p-4 flex items-center gap-4">
            <span className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-none" style={{ background: 'var(--lilac)', color: 'var(--purple)' }}><HeartHandshake size={30} strokeWidth={2.3} /></span>
            <span className="flex-1"><span className="block h-display text-[1.25rem]">Want to start a group?</span><span className="block font-bold mt-1" style={{ color: 'var(--mute)' }}>Tell your support worker</span></span>
          </div></li>
        </ul>
      </Main>
    </Shell>
  )
}

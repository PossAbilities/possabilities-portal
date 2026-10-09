import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CalendarDays, Check, ExternalLink } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { fetchEasyRead, fetchEasyReadOne, fetchWorkshops } from '../lib/data'
import { Toolkit } from '../components/Toolkit'
import type { EasyReadDoc, Workshop } from '../lib/types'
import { whenShort } from '../lib/format'
import { Shell, Main } from '../components/Shell'
import { SectionHeader } from '../components/SectionHeader'
import { ReadingBar, ListenButton } from '../components/Listen'
import { Paper } from '../illustrations/Paper'
import { speak, stop } from '../lib/speech'
import { chime, tap } from '../lib/sound'
import * as Icons from 'lucide-react'

function StepIcon({ name }: { name?: string | null }) {
  const key = (name || 'circle').split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('') as keyof typeof Icons
  const I = (Icons[key] as typeof Icons.Circle) || Icons.Circle
  return <I size={30} strokeWidth={2.4} />
}

export function Learn() {
  const { session } = useApp()
  const [tab, setTab] = useState<'workshops' | 'easyread'>('workshops')
  const [ws, setWs] = useState<Workshop[]>([]); const [docs, setDocs] = useState<EasyReadDoc[]>([])
  useEffect(() => { fetchWorkshops(session?.user.id).then(setWs); fetchEasyRead().then(setDocs) }, [session])
  return (
    <Shell>
      <SectionHeader section="learn" title="Learn" />
      <Main>
        <div role="tablist" aria-label="Learn" className="card p-1.5 grid grid-cols-2 gap-1" style={{ boxShadow: 'inset 0 0 0 2px var(--lilac)' }}>
          {(['workshops', 'easyread'] as const).map(t => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="btn min-h-[52px]" style={tab === t ? { background: 'var(--purple)', color: '#fff' } : { background: 'transparent', color: 'var(--purple)' }}>
              {t === 'workshops' ? <CalendarDays size={20} strokeWidth={2.6} /> : <BookOpen size={20} strokeWidth={2.6} />}{t === 'workshops' ? 'Workshops' : 'Easy Read'}
            </button>
          ))}
        </div>
        {tab === 'workshops' ? ws.map(w => (
          <section key={w.id} className="flex flex-col gap-3">
            <h2 className="h-display m-0 text-[1.6rem] md:text-[2rem]" style={{ color: 'var(--purple)' }}>{w.title}</h2>
            {w.summary && <p className="m-0 text-[1.1rem] font-bold measure hide-when-simple" style={{ color: 'var(--mute)' }}>{w.summary}</p>}
            {w.next_session_at && <p className="m-0 flex items-center gap-2 font-bold" style={{ color: 'var(--purple)' }}><CalendarDays size={20} strokeWidth={2.4} />Next session: {whenShort(w.next_session_at)}</p>}
            <h3 className="h-display m-0 mt-2 text-[1.15rem]" style={{ color: 'var(--mute)' }}>Your tools</h3>
            <Toolkit items={w.steps ?? []} />
          </section>
        )        ) : (
          <ul className="list-none m-0 p-0 flex flex-col gap-4">
            {docs.map(d => (
              <li key={d.id}><Link to={`/learn/read/${d.id}`} className="card p-4 flex items-center gap-4"><Paper w={52} /><span className="flex-1 min-w-0"><span className="block h-display text-[1.25rem]">{d.title}</span>{d.category && <span className="block font-bold mt-1" style={{ color: 'var(--mute)' }}>{d.category}</span>}</span><ExternalLink size={0} /></Link></li>
            ))}
          </ul>
        )}
        {tab === 'workshops' && ws.length === 0 && <p className="font-bold" style={{ color: 'var(--mute)' }}>No workshops yet.</p>}
      </Main>
    </Shell>
  )
}

/** Easy Read reader: one step per row, a picture beside the words, read aloud with the current step highlighted. */
export function Reader() {
  const { id } = useParams(); const { settings } = useApp()
  const [doc, setDoc] = useState<EasyReadDoc | null>(null); const [cur, setCur] = useState(0); const [playing, setPlaying] = useState(false)
  useEffect(() => { if (id) fetchEasyReadOne(id).then(setDoc) }, [id])
  useEffect(() => () => stop(), [])
  const steps = doc?.steps ?? []
  const readFrom = (i: number) => {
    if (i >= steps.length) { setPlaying(false); setCur(0); chime(); setDone(true); window.setTimeout(() => setDone(false), 4000); return }
    setCur(i); setPlaying(true); speak(steps[i].text, () => readFrom(i + 1))
  }
  const toggle = () => { if (playing) { stop(); setPlaying(false) } else readFrom(cur) }
  const [done, setDone] = useState(false)
  if (!doc) return <Shell><SectionHeader section="learn" title="Learn" /></Shell>
  return (
    <Shell>
      <SectionHeader section="learn" hideAvatar minHeight={150} pose={done ? 'done' : playing ? 'reading-aloud' : 'reading'}>
        <Link to="/learn" className="btn mb-3" style={{ background: 'var(--purple)', color: '#fff' }}><ArrowLeft size={22} strokeWidth={2.6} />Back</Link>
        <h1 className="h-display m-0 text-[1.6rem] md:text-[2.2rem]" style={{ color: 'var(--purple)' }}>{doc.title}</h1>
      </SectionHeader>
      <Main className={`${settings.read_aloud ? 'pb-40' : ''} max-w-[760px]`}>
        {!settings.read_aloud && <ListenButton text={steps.map(s => s.text).join('. ')} className="self-start" />}
        <ol className="list-none m-0 p-0 flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={i} className="card flex items-center gap-4 p-2.5 pr-4 min-h-[76px]" aria-current={playing && cur === i ? 'step' : undefined}
              style={playing && cur === i ? { background: 'var(--tint-teal)', boxShadow: 'inset 0 0 0 4px var(--teal)' } : {}}>
              {settings.pictures && (s.image_url ? <img src={s.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover flex-none" /> : <span className="w-16 h-16 rounded-2xl flex items-center justify-center flex-none" style={{ background: playing && cur === i ? 'var(--pink)' : 'var(--purple)', color: '#fff' }}><StepIcon name={s.icon} /></span>)}
              <button className="flex-1 text-left bg-transparent border-0 p-0 text-[1.25rem] font-extrabold leading-snug" style={{ color: 'var(--ink)' }} onClick={() => { tap(); readFrom(i) }}>{s.text}</button>
            </li>
          ))}
        </ol>
      </Main>
      {settings.read_aloud && steps.length > 0 && <ReadingBar step={cur + 1} total={steps.length} playing={playing} onToggle={toggle} />}
    </Shell>
  )
}

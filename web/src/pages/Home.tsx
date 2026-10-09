import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Play, Newspaper, Check, ChevronRight } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { countNewSince, fetchEasyRead, fetchMoments, fetchNews, fetchVideos, fetchWorkshops } from '../lib/data'
import type { EasyReadDoc, NewsPost, Video, Workshop } from '../lib/types'
import { greeting, whenShort } from '../lib/format'
import { Shell, Main } from '../components/Shell'
import { Logo } from '../components/Logo'
import { AvatarLink } from '../components/Nav'
import { Character } from '../illustrations/Character'
import { pickGreeter, type Greeter } from '../lib/greeter'
import { Atmosphere } from '../illustrations/Atmosphere'
import { Paper } from '../illustrations/Paper'
import { MediaFrame } from '../illustrations/Artwork'

import { Toolkit } from '../components/Toolkit'

/** True on the first Home visit this session: the arrival moment plays once, not on every tab change. */
function useArrival() {
  const [arrive] = useState(() => { try { if (sessionStorage.getItem('pa-arrived')) return false; sessionStorage.setItem('pa-arrived', '1'); return true } catch { return false } })
  return arrive
}

export function Home() {
  const { profile, session } = useApp(); const arrive = useArrival()
  useEffect(() => { document.body.dataset.tone = 'home' }, [])
  const [greeter, setGreeter] = useState<Greeter>(() => pickGreeter())
  useEffect(() => { fetchMoments().then(ms => { if (ms.length) setGreeter(pickGreeter(ms)) }).catch(() => {}) }, [])
  const [news, setNews] = useState<NewsPost[]>([]); const [docs, setDocs] = useState<EasyReadDoc[]>([]); const [vids, setVids] = useState<Video[]>([]); const [ws, setWs] = useState<Workshop[]>([]); const [fresh, setFresh] = useState(0)
  useEffect(() => {
    fetchNews(3).then(setNews); fetchEasyRead(3).then(setDocs); fetchVideos(3).then(setVids); fetchWorkshops(session?.user.id).then(setWs)
    countNewSince(profile?.last_seen_at ?? null).then(setFresh)
  }, [session, profile?.last_seen_at])
  const name = profile?.first_name || profile?.display_name || 'there'
  const w = ws[0]
  return (
    <Shell>
      <header className={`tone-head ${arrive ? 'arrive' : 'page-enter'}`} style={{ color: '#fff', paddingTop: 'env(safe-area-inset-top)' }}>
        <Atmosphere rim="var(--pink)" strength={1.2} />
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 pt-4 md:pt-7 pb-6 md:pb-10 lg:pb-14 flex items-start justify-between gap-4" style={{ minHeight: 236 }}>
          <div className="min-w-0 flex-1 pr-[130px] md:pr-[240px] lg:pr-[320px]">
            <div className="flex items-center justify-between gap-4 lg:hidden"><span className="md:hidden"><Logo dark /></span><span className="hidden md:block" /><span className="hidden md:block"><AvatarLink initial={name[0].toUpperCase()} /></span></div>
            <h1 className="arrive-text h-display m-0 mt-3 text-[2.6rem] md:text-[3.4rem] lg:text-[5.5rem]"><span className="hidden md:inline">{greeting()},<br /></span><span className="md:hidden">Hi </span>{name}</h1>
            <p className="arrive-text m-0 mt-2 text-[1.2rem] md:text-[1.5rem] font-bold" style={{ color: 'var(--teal)' }}>{greeter.line ?? (fresh > 0 ? `${fresh} new thing${fresh === 1 ? '' : 's'} for you` : 'Nothing new since last time')}</p>
          </div>
        </div>
        <div className="tone-char char-float right-4 md:right-10 lg:right-16 hero-float">
          <Character name={greeter.name} pose={greeter.pose} height={200} className="md:h-[280px]! lg:h-[340px]!" />
        </div>
      </header>
      <Main inner={arrive ? 'arrive-main stagger' : ''}>
        <h2 className="h-display m-0 text-[1.5rem] md:text-[2rem]">New this week</h2>
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-5">
            {w && (
              <div className="card p-5 md:p-7 flex flex-col gap-4" style={{ background: 'var(--tint-teal)' }}>
                <Link to="/learn" className="pill self-start" style={{ background: 'var(--teal)', color: 'var(--purple)' }}><BookOpen size={18} strokeWidth={2.6} />Workshop</Link>
                <span className="h-display text-[1.7rem] md:text-[2.3rem]" style={{ color: 'var(--purple)' }}>{w.title}</span>
                {w.next_session_at && <span className="text-[1rem] font-bold" style={{ color: 'var(--purple)' }}>Next session: {whenShort(w.next_session_at)}</span>}
                <Toolkit items={(w.steps ?? []).slice(0, 4)} compact />
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {docs[0] && (
                <Link to={`/learn/read/${docs[0].id}`} className="card p-5 flex gap-4 items-start">
                  <Paper w={56} />
                  <span className="flex-1 min-w-0"><span className="pill mb-2" style={{ background: 'var(--tint-teal)', color: 'var(--purple)' }}><BookOpen size={16} strokeWidth={2.6} />Easy Read</span><span className="block h-display text-[1.3rem]">{docs[0].title}</span></span>
                </Link>
              )}
              {news[0] && (
                <Link to={`/news/${news[0].id}`} className="card p-5 flex flex-col gap-3" style={{ background: 'var(--pink)', color: '#fff' }}>
                  <span className="pill self-start" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}><Newspaper size={16} strokeWidth={2.6} />News</span>
                  <span className="h-display text-[1.5rem]">{news[0].title}</span>
                </Link>
              )}
            </div>
          </div>
          <aside className="flex flex-col gap-5">
            {vids[0] && (
              <Link to="/videos" className="card p-3.5 flex lg:flex-col gap-4 items-center lg:items-stretch">
                <MediaFrame src={vids[0].poster_url} seed={vids[0].id} play className="w-[150px] lg:w-full aspect-[16/10] rounded-[24px] flex-none" foot={false} />
                <span className="flex-1 min-w-0"><span className="pill mb-2" style={{ background: 'var(--tint-pink)', color: 'var(--purple)' }}><Play size={16} strokeWidth={2.6} />Video</span><span className="block h-display text-[1.25rem]">{vids[0].title}</span></span>
              </Link>
            )}
            <Link to="/groups" className="card p-4 flex items-center gap-4"><span className="w-16 h-16 rounded-2xl flex items-center justify-center flex-none" style={{ background: 'var(--lilac)', color: 'var(--purple)' }}><ChevronRight size={28} strokeWidth={2.6} /></span><span className="flex-1"><span className="block text-[0.85rem] font-extrabold" style={{ color: 'var(--mute)' }}>Groups</span><span className="block h-display text-[1.2rem]">See your groups</span></span></Link>
          </aside>
        </div>
      </Main>
    </Shell>
  )
}

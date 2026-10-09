import { useEffect, useState } from 'react'
import { Play, Captions } from 'lucide-react'
import { fetchVideos } from '../lib/data'
import type { Video } from '../lib/types'
import { Shell, Main } from '../components/Shell'
import { SectionHeader } from '../components/SectionHeader'
import { MediaFrame } from '../illustrations/Artwork'

export function Videos() {
  const [vids, setVids] = useState<Video[]>([]); const [open, setOpen] = useState<Video | null>(null); const [cc, setCc] = useState(true)
  useEffect(() => { fetchVideos().then(v => { setVids(v); setOpen(v[0] ?? null) }) }, [])
  const rest = vids.filter(v => v.id !== open?.id)
  const isEmbed = (u: string) => /youtube|youtu\.be|vimeo|mux\.com\/player/.test(u)
  return (
    <Shell>
      <SectionHeader section="videos" title="Videos" pose={open ? 'listening' : undefined} />
      <Main>
        {open && (
          <section className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="flex flex-col gap-4">
              <div className="card overflow-hidden aspect-video" style={{ background: 'var(--purple)' }}>
                {open.playback_url ? (isEmbed(open.playback_url)
                  ? <iframe title={open.title} src={open.playback_url} className="w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  : <video controls playsInline poster={open.poster_url ?? undefined} className="w-full h-full" crossOrigin="anonymous">
                      <source src={open.playback_url} />{open.captions_url && <track kind="captions" srcLang="en" label="English" src={open.captions_url} default={cc} />}
                    </video>)
                  : <MediaFrame src={open.poster_url} seed={open.id} play className="w-full h-full" foot={false} />}
              </div>
              <h2 className="h-display m-0 text-[1.6rem] md:text-[2.2rem]">{open.title}</h2>
              {open.description && <p className="m-0 text-[1.1rem] leading-snug hide-when-simple">{open.description}</p>}
              <div className="flex flex-wrap gap-3">
                <button aria-pressed={cc} onClick={() => setCc(c => !c)} className="btn" style={cc ? { background: 'var(--purple)', color: '#fff' } : { background: 'var(--card)', color: 'var(--purple)', boxShadow: 'inset 0 0 0 2px var(--purple)' }}><Captions size={22} strokeWidth={2.6} />Subtitles {cc ? 'on' : 'off'}</button>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <h3 className="h-display m-0 text-[1.35rem]">More to watch</h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-4">
                {rest.map(v => (
                  <li key={v.id}><button onClick={() => { setOpen(v); window.scrollTo({ top: 0 }) }} className="card w-full text-left p-3 flex items-center gap-3.5 border-0">
                    <MediaFrame src={v.poster_url} seed={v.id} className="w-[116px] h-[72px] rounded-[16px] flex-none" />
                    <span className="flex-1 min-w-0 flex flex-col gap-1"><span className="h-display text-[1.15rem]">{v.title}</span>{v.captions_url && <span className="pill self-start" style={{ background: 'var(--purple)', color: '#fff', fontSize: '0.75rem' }}><Captions size={14} strokeWidth={2.6} />Subtitles</span>}</span>
                    <Play size={26} strokeWidth={2.6} style={{ color: 'var(--purple)' }} />
                  </button></li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {vids.length === 0 && <p className="font-bold" style={{ color: 'var(--mute)' }}>No videos yet.</p>}
      </Main>
    </Shell>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react'
import { fetchNews, fetchNewsOne } from '../lib/data'
import type { NewsPost } from '../lib/types'
import { Shell, Main } from '../components/Shell'
import { SectionHeader } from '../components/SectionHeader'
import { ListenButton } from '../components/Listen'
import { Hero } from '../illustrations/Hero'
import { MediaFrame } from '../illustrations/Artwork'

export function News() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  useEffect(() => { fetchNews().then(setPosts) }, [])
  const [hero, ...rest] = posts
  return (
    <Shell>
      <SectionHeader section="news" title="News" />
      <Main>
        {hero && (
          <Link to={`/news/${hero.id}`} className="card overflow-hidden flex flex-col lg:flex-row" style={{ background: 'var(--purple)', color: '#fff' }}>
            <MediaFrame src={hero.image_url} seed={hero.id} className="h-[210px] lg:h-auto lg:w-[48%] lg:min-h-[300px] flex-none" foot={false}>
              {!hero.image_url && <div className="relative h-[150px] -mb-2"><Hero /></div>}
            </MediaFrame>
            <div className="p-5 lg:p-7 flex flex-col gap-4 lg:justify-center">
              <span className="pill self-start" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>Latest</span>
              <h2 className="h-display m-0 text-[1.7rem] lg:text-[2.4rem]">{hero.title}</h2>
              {hero.summary && <p className="m-0 text-[1.1rem] leading-snug hide-when-simple measure">{hero.summary}</p>}
              <div className="flex gap-2.5"><span className="btn self-start" style={{ background: 'var(--pink)', color: '#fff' }}><BookOpen size={22} strokeWidth={2.6} />Read</span></div>
            </div>
          </Link>
        )}
        <ul className="list-none m-0 p-0 flex flex-col gap-4">
          {rest.map(p => (
            <li key={p.id}><Link to={`/news/${p.id}`} className="card p-3.5 flex items-center gap-4">
              <MediaFrame src={p.image_url} seed={p.id} className="w-[96px] h-[80px] rounded-[18px] flex-none" />
              <span className="flex-1 min-w-0"><span className="block h-display text-[1.2rem]">{p.title}</span>{p.read_minutes && <span className="block text-[0.9rem] font-bold mt-1" style={{ color: 'var(--mute)' }}>{p.read_minutes} minute read</span>}</span>
              <ChevronRight size={26} strokeWidth={2.6} style={{ color: 'var(--purple)' }} />
            </Link></li>
          ))}
        </ul>
        {posts.length === 0 && <p className="text-[1.1rem] font-bold" style={{ color: 'var(--mute)' }}>No news yet. Check back soon.</p>}
      </Main>
    </Shell>
  )
}

export function Story() {
  const { id } = useParams(); const [post, setPost] = useState<NewsPost | null>(null)
  useEffect(() => { if (id) fetchNewsOne(id).then(setPost) }, [id])
  if (!post) return <Shell><SectionHeader section="news" title="News" /></Shell>
  const paragraphs = (post.body_easy || post.summary || '').split(/\n+/).filter(Boolean)
  return (
    <Shell>
      <SectionHeader section="news" hideAvatar minHeight={150} pose="reading">
        <Link to="/news" className="btn" style={{ background: 'var(--purple)', color: '#fff' }}><ArrowLeft size={22} strokeWidth={2.6} />Back to News</Link>
        <h1 className="h-display m-0 mt-4 text-[1.9rem] md:text-[2.8rem] max-w-[22ch]">{post.title}</h1>
        {post.read_minutes && <p className="m-0 mt-2 font-bold opacity-90">{post.read_minutes} minute read</p>}
      </SectionHeader>
      <Main className="max-w-[760px]">
        <div className="flex flex-wrap gap-3"><ListenButton text={`${post.title}. ${paragraphs.join(' ')}`} />
          {post.easy_read_doc_id && <Link to={`/learn/read/${post.easy_read_doc_id}`} className="btn" style={{ background: 'var(--tint-teal)', color: 'var(--purple)' }}><BookOpen size={22} strokeWidth={2.6} />Easy Read</Link>}
        </div>
        <MediaFrame src={post.image_url} seed={post.id} className="card h-[240px] md:h-[340px]" foot={false}>{!post.image_url && <div className="relative h-[180px] md:h-[260px]"><Hero /></div>}</MediaFrame>
        {paragraphs.map((t, i) => <p key={i} className="m-0 text-[1.25rem] leading-relaxed measure">{t}</p>)}
        {post.easy_read_doc_id && (
          <Link to={`/learn/read/${post.easy_read_doc_id}`} className="card p-5 flex items-center gap-4" style={{ background: 'var(--tint-teal)', color: 'var(--purple)' }}>
            <BookOpen size={36} strokeWidth={2.4} /><span className="flex-1 h-display text-[1.5rem]">Read this story in Easy Read</span><ChevronRight size={28} strokeWidth={2.6} />
          </Link>
        )}
      </Main>
    </Shell>
  )
}

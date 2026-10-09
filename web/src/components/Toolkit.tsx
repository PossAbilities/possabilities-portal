import { Link } from 'react-router-dom'
import { Presentation, Play, NotebookPen, BookOpen, Users, ArrowUpRight } from 'lucide-react'
import type { WorkshopStep } from '../lib/types'

/** What each kind of workshop resource looks like. One vocabulary across Home and Learn. */
export const KIND: Record<WorkshopStep['kind'], { label: string; Icon: typeof Play; bg: string; fg: string }> = {
  slides:   { label: 'Slides',    Icon: Presentation, bg: 'var(--purple)',    fg: '#fff' },
  video:    { label: 'Video',     Icon: Play,         bg: 'var(--pink)',      fg: '#fff' },
  workbook: { label: 'Workbook',  Icon: NotebookPen,  bg: 'var(--teal)',      fg: 'var(--purple)' },
  easyread: { label: 'Easy Read', Icon: BookOpen,     bg: 'var(--tint-teal)', fg: 'var(--purple)' },
  session:  { label: 'Session',   Icon: Users,        bg: 'var(--lilac)',     fg: 'var(--purple)' },
}

/** A workshop's tools: slides to go through, videos to watch, a workbook to follow along, an Easy Read. No order implied. */
export function Toolkit({ items, compact = false }: { items: WorkshopStep[]; compact?: boolean }) {
  return (
    <ul className={`list-none m-0 p-0 grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {items.map(r => {
        const k = KIND[r.kind] ?? KIND.session
        const inner = (
          <>
            <span className={`flex-none rounded-[18px] flex items-center justify-center ${compact ? 'w-12 h-12' : 'w-14 h-14'}`} style={{ background: k.bg, color: k.fg }}><k.Icon size={compact ? 24 : 28} strokeWidth={2.4} /></span>
            <span className="flex-1 min-w-0">
              <span className="block text-[0.85rem] font-extrabold" style={{ color: 'var(--mute)' }}>{k.label}</span>
              <span className={`block h-display ${compact ? 'text-[1.05rem]' : 'text-[1.2rem]'}`}>{r.title}</span>
              {!compact && r.subtitle && <span className="block font-bold mt-0.5 hide-when-simple" style={{ color: 'var(--mute)' }}>{r.subtitle}</span>}
            </span>
            {!compact && <ArrowUpRight size={22} strokeWidth={2.6} className="flex-none" style={{ color: 'var(--purple)' }} />}
          </>
        )
        const cls = `card flex items-center gap-3 ${compact ? 'p-3' : 'p-4'}`
        const internal = r.resource_url?.startsWith('/')
        return (
          <li key={r.id} className="min-w-0">
            {r.resource_url ? (internal ? <Link to={r.resource_url} className={cls}>{inner}</Link> : <a href={r.resource_url} target="_blank" rel="noreferrer" className={cls}>{inner}</a>) : <div className={cls} style={{ opacity: 0.75 }}>{inner}</div>}
          </li>
        )
      })}
    </ul>
  )
}

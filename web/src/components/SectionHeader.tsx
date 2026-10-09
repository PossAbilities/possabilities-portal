import { useEffect, type ReactNode } from 'react'
import { SECTION, type SectionKey } from '../lib/tokens'
import { Atmosphere } from '../illustrations/Atmosphere'
import { AvatarLink } from './Nav'
import { useApp } from '../lib/AppContext'
import { Character, SECTION_CHARACTER } from '../illustrations/Character'

/** Coloured header with the brand wave. Colour comes from the section so each area is recognisable at a glance. */
export function SectionHeader({ section, title, children, minHeight = 0, hideAvatar = false, character = true, pose }: { section: SectionKey; title?: ReactNode; children?: ReactNode; minHeight?: number; hideAvatar?: boolean; character?: boolean; pose?: string }) {
  const s = SECTION[section]; const { profile } = useApp()
  const initial = (profile?.first_name || profile?.display_name || 'Y')[0].toUpperCase()
  useEffect(() => { document.body.dataset.tone = section }, [section])
  return (
    <header className="tone-head page-enter" style={{ color: s.fg, paddingTop: 'env(safe-area-inset-top)' }}>
      <Atmosphere rim={s.rim} />
      <div className="relative px-6 pt-5 pb-4 md:px-10 md:pt-9 md:pb-6 max-w-[1200px] mx-auto flex items-start justify-between gap-4" style={{ minHeight: character && (title || pose) ? Math.max(minHeight, 172) : minHeight }}>
        <div className={`min-w-0 flex-1 ${character && (title || pose) && SECTION_CHARACTER[section] ? 'pr-[120px] md:pr-[200px]' : ''}`}>
          {title && <h1 className="h-display m-0 text-[2.9rem] md:text-[3.6rem]">{title}</h1>}
          {children}
        </div>
        
      </div>
      {character && (title || pose) && SECTION_CHARACTER[section] && (
        <div className="tone-char char-float right-4 md:right-10 lg:right-16">
          <Character name={SECTION_CHARACTER[section]} pose={pose} height={180} className="md:!h-[240px] lg:!h-[280px]" />
        </div>
      )}
    </header>
  )
}

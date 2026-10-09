import { NavLink, useLocation } from 'react-router-dom'
import { House, Newspaper, BookOpen, Play, Users, SlidersHorizontal } from 'lucide-react'
import { SECTION, type SectionKey } from '../lib/tokens'
import { Logo } from './Logo'
import { useApp } from '../lib/AppContext'
import { tap } from '../lib/sound'

const ITEMS: { key: SectionKey; to: string; Icon: typeof House }[] = [
  { key: 'home', to: '/', Icon: House }, { key: 'news', to: '/news', Icon: Newspaper }, { key: 'learn', to: '/learn', Icon: BookOpen },
  { key: 'videos', to: '/videos', Icon: Play }, { key: 'groups', to: '/groups', Icon: Users },
]
export function activeSection(path: string): SectionKey {
  const k = path.split('/')[1] as SectionKey
  return (['news', 'learn', 'videos', 'groups'] as string[]).includes(k) ? k : 'home'
}

/** Phone: bottom tab bar. Active tab filled with its section colour. */
export function TabBar() {
  const path = useLocation().pathname; const sec = activeSection(path); const me = path === '/settings'
  const { profile } = useApp(); const initial = (profile?.first_name || profile?.display_name || 'Me')[0].toUpperCase()
  return (
    <nav aria-label="Main" className="fixed left-3 right-3 z-20 md:hidden glass rounded-[32px]" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}>
      <ul className="grid grid-cols-6 h-[80px] list-none m-0 p-0">
        {ITEMS.map(({ key, to, Icon }) => {
          const on = sec === key && !me, s = SECTION[key]
          return (
            <li key={key}>
              <NavLink to={to} onClick={tap} aria-current={on ? 'page' : undefined} className="tab flex flex-col items-center justify-center h-full gap-1 text-[0.75rem] font-extrabold" style={{ color: on ? 'var(--purple)' : 'var(--mute)' }}>
                <span className="tab-pill w-12 h-9 rounded-full flex items-center justify-center" style={on ? { background: s.bg, color: s.fg } : { background: 'transparent' }}><Icon size={25} strokeWidth={2.4} /></span>
                <span style={{ fontWeight: on ? 900 : 800 }}>{s.label}</span>
              </NavLink>
            </li>
          )
        })}
        <li>
          <NavLink to="/settings" onClick={tap} aria-current={me ? 'page' : undefined} aria-label="Me: my settings" className="tab flex flex-col items-center justify-center h-full gap-1 text-[0.75rem] font-extrabold" style={{ color: me ? 'var(--purple)' : 'var(--mute)' }}>
            <span className="tab-pill w-9 h-9 rounded-full flex items-center justify-center h-display text-[1.05rem]" style={me ? { background: 'var(--purple)', color: '#fff' } : { background: 'var(--lilac)', color: 'var(--purple)' }}>{initial}</span>
            <span style={{ fontWeight: me ? 900 : 800 }}>Me</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

/** Tablet: left rail. Desktop: top bar. One component, breakpoint-driven. */
export function Rail() {
  const sec = activeSection(useLocation().pathname)
  return (
    <>
      <nav aria-label="Main" className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 w-[140px] flex-col items-center py-7 gap-2 z-20" style={{ background: 'var(--purple)' }}>
        <div className="mb-4"><Logo dark size={17} stacked /></div>
        {ITEMS.map(({ key, to, Icon }) => {
          const on = sec === key, s = SECTION[key]
          return (
            <NavLink key={key} to={to} aria-current={on ? 'page' : undefined} className="tab w-[116px] h-[60px] rounded-[20px] flex flex-col items-center justify-center gap-0.5 text-[0.78rem] font-extrabold" style={on ? { background: s.bg, color: s.fg, boxShadow: 'inset 0 0 0 3px #fff', transition: 'background-color var(--t-mid) var(--ease)' } : { color: '#fff', transition: 'background-color var(--t-mid) var(--ease)' }}>
              <Icon size={26} strokeWidth={2.4} />{s.label}
            </NavLink>
          )
        })}
        <NavLink to="/settings" className="mt-auto w-[116px] h-[60px] rounded-2xl flex flex-col items-center justify-center gap-0.5 text-[0.78rem] font-extrabold" style={sec === 'home' && location.pathname === '/settings' ? { background: 'var(--teal)', color: 'var(--purple)' } : { color: '#fff' }}>
          <SlidersHorizontal size={24} strokeWidth={2.4} />Settings
        </NavLink>
      </nav>
      <header className="hidden lg:block sticky top-0 z-20 glass-ink" style={{ color: '#fff' }}>
        <div className="max-w-[1200px] mx-auto px-10 min-h-[88px] flex items-center justify-between gap-3">
          <Logo dark size={30} />
          <nav aria-label="Main" className="flex gap-1">
            {ITEMS.map(({ key, to, Icon }) => {
              const on = sec === key
              return (
                <NavLink key={key} to={to} aria-current={on ? 'page' : undefined} className="tab relative h-14 px-5 flex items-center gap-2 text-[1.15rem] text-white rounded-full" style={{ fontWeight: on ? 900 : 800, background: on ? 'rgba(255,255,255,0.12)' : 'transparent', transition: 'background-color var(--t-mid) var(--ease)' }}>
                  <Icon size={24} strokeWidth={2.3} />{SECTION[key].label}
                  <span className="absolute left-5 right-5 bottom-1 h-1 rounded-full" style={{ background: 'var(--teal)', transform: on ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform var(--t-mid) var(--ease)' }} />
                </NavLink>
              )
            })}
          </nav>
          <AvatarLink />
        </div>
      </header>
    </>
  )
}
export function AvatarLink({ initial = 'S', size = 48 }: { initial?: string; size?: number }) {
  return (
    <NavLink to="/settings" aria-label="My settings" className="rounded-full flex items-center justify-center h-display btn min-h-0! p-0!" style={{ width: size, height: size, background: 'var(--card)', color: 'var(--purple)', fontSize: size * 0.44, boxShadow: '0 0 0 3px rgba(255,255,255,0.55), 0 6px 16px rgba(36,5,48,0.18)' }}>{initial}</NavLink>
  )
}

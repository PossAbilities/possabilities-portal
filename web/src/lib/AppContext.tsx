import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Profile, Settings } from './types'
import { setSoundsEnabled } from './sound'

const DEFAULTS: Omit<Settings, 'user_id'> = { text_size: 'medium', theme: 'standard', read_aloud: true, pictures: true, simplified: false, sounds: false, reduce_motion: false }
type Ctx = {
  session: Session | null; profile: Profile | null; settings: Omit<Settings, 'user_id'>; loading: boolean
  updateSettings: (patch: Partial<Omit<Settings, 'user_id'>>) => Promise<void>
  signOut: () => Promise<void>
}
const AppCtx = createContext<Ctx>(null!)
export const useApp = () => useContext(AppCtx)

function applyToDocument(s: Omit<Settings, 'user_id'>) {
  const html = document.documentElement
  html.dataset.theme = s.theme; html.dataset.size = s.text_size
  html.classList.toggle('simplified', s.simplified); html.classList.toggle('no-pictures', !s.pictures)
  html.classList.toggle('reduce-motion', !!s.reduce_motion); setSoundsEnabled(!!s.sounds)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('pa-settings') || '{}') } } catch { return DEFAULTS }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { applyToDocument(settings); localStorage.setItem('pa-settings', JSON.stringify(settings)) }, [settings])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setProfile(null); return }
    const uid = session.user.id
    ;(async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
      setProfile(p as Profile | null)
      const { data: s } = await supabase.from('user_settings').select('*').eq('user_id', uid).maybeSingle()
      if (s) { const { user_id, ...rest } = s as Settings; setSettings(rest) }
      await supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', uid)
    })()
  }, [session])

  const updateSettings: Ctx['updateSettings'] = async patch => {
    const next = { ...settings, ...patch }; setSettings(next)
    if (session) await supabase.from('user_settings').upsert({ user_id: session.user.id, ...next })
  }
  const signOut = async () => { await supabase.auth.signOut() }
  return <AppCtx.Provider value={{ session, profile, settings, loading, updateSettings, signOut }}>{children}</AppCtx.Provider>
}

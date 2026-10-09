import { useState } from 'react'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import { supabase, DEMO } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { Hero } from '../illustrations/Hero'
import { Atmosphere } from '../illustrations/Atmosphere'

/** Magic link sign-in: type your email, tap the link we send. No password to remember. */
export function SignIn() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null)
  const send = async () => {
    setBusy(true); setErr(null)
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin + '/' } })
    setBusy(false); if (error) setErr(error.message); else if (!DEMO) setSent(true)
  }
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--ground)' }}>
      <header className="tone-head" style={{ ["--tone" as string]: 'var(--page-home)', color: '#fff', paddingTop: 'env(safe-area-inset-top)' }}>
        <Atmosphere rim="var(--pink)" strength={1.2} />
        <div className="relative px-6 pt-6 max-w-[900px] mx-auto"><Logo dark size={26} /></div>
        <div className="relative max-w-[900px] mx-auto flex items-end justify-between gap-4 px-6 pt-4 pb-6">
          <h1 className="h-display m-0 text-[2.6rem] md:text-[3.4rem]">Welcome<br />back</h1>
          <div className="w-[56%] max-w-[380px] h-[160px] md:h-[230px] -mb-10 md:-mb-12 relative z-[2]"><Hero crop={false} /></div>
        </div>
      </header>
      <main className="sheet flex-1 px-6 pt-10 pb-10 w-full flex flex-col gap-4 [&>*]:max-w-[560px] [&>*]:w-full [&>*]:mx-auto">
        {sent ? (
          <div className="card p-6 flex flex-col gap-3" style={{ background: 'var(--tint-teal)' }}>
            <CheckCircle2 size={44} strokeWidth={2.4} style={{ color: 'var(--purple)' }} />
            <h2 className="h-display m-0 text-[1.6rem]">Check your email</h2>
            <p className="m-0 text-[1.15rem] leading-snug">We sent a link to <strong>{email}</strong>. Tap the link to sign in. It works for 1 hour.</p>
            <p className="m-0 text-[1rem]" style={{ color: 'var(--mute)' }}>Can't see it? Look in Junk, or ask your support worker.</p>
            <button className="btn self-start" style={{ background: 'var(--purple)', color: '#fff' }} onClick={() => setSent(false)}>Try a different email</button>
          </div>
        ) : (
          <>
            <h2 className="h-display m-0 text-[1.7rem]">Sign in with your email</h2>
            <p className="m-0 text-[1.15rem] leading-snug">No password. We send you a link and you tap it.</p>
            <label className="flex flex-col gap-2 text-[1.05rem] font-extrabold">Your email
              <span className="flex items-center gap-3 rounded-[22px] px-4" style={{ background: 'var(--card)', boxShadow: 'inset 0 0 0 3px var(--lilac)', transition: 'box-shadow var(--t-mid) var(--ease)' }}>
                <Mail size={24} style={{ color: 'var(--purple)' }} />
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="flex-1 h-16 bg-transparent border-0 outline-none text-[1.2rem] font-bold" />
              </span>
            </label>
            {err && <p role="alert" className="m-0 font-bold" style={{ color: 'var(--pink-dark)' }}>{err}</p>}
            <button className="btn btn-lg" disabled={busy || !email.includes('@')} onClick={send} style={{ background: 'var(--pink)', color: '#fff', opacity: busy ? 0.7 : 1 }}><Send size={24} strokeWidth={2.6} />{busy ? 'Sending…' : 'Send me the link'}</button>
            <p className="m-0 text-[1rem] mt-2" style={{ color: 'var(--mute)' }}>Don't have an email? Your support worker can help you set one up.</p>
          </>
        )}
      </main>
    </div>
  )
}

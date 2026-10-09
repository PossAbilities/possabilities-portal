import { useEffect, useState } from 'react'
import { Volume2, Pause, Square } from 'lucide-react'
import { speak, stop, slower, speechSupported } from '../lib/speech'
import { useApp } from '../lib/AppContext'
import { tap } from '../lib/sound'

/** "Listen" button: reads text aloud using the device voice. Hidden if read-aloud is switched off in settings. */
export function ListenButton({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const { settings } = useApp(); const [on, setOn] = useState(false)
  useEffect(() => () => stop(), [])
  if (!settings.read_aloud || !speechSupported()) return null
  return (
    <button className={`btn ${className}`} style={{ background: 'var(--purple)', color: '#fff', ...style }} aria-pressed={on}
      onClick={() => { tap(); if (on) { stop(); setOn(false) } else { setOn(true); speak(text, () => setOn(false)) } }}>
      {on ? <Pause size={24} strokeWidth={2.6} /> : <Volume2 size={24} strokeWidth={2.6} />}{on ? 'Stop' : 'Listen'}
    </button>
  )
}
/** Sticky "Reading to you" bar for the Easy Read reader. */
export function ReadingBar({ step, total, playing, onToggle }: { step: number; total: number; playing: boolean; onToggle: () => void }) {
  return (
    <div className="fixed float-bar z-30 rounded-[30px] px-4 py-4 flex items-center gap-3 md:left-[152px]! lg:left-auto! lg:right-8! lg:bottom-8! lg:w-[420px]" style={{ background: 'var(--glass-ink)', WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(1.4)', backdropFilter: 'blur(var(--glass-blur)) saturate(1.4)', color: '#fff', boxShadow: 'var(--shadow-glass)' }}>
      <button aria-label={playing ? 'Pause reading' : 'Start reading'} onClick={onToggle} className="flex-none w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--pink)', color: '#fff' }}>{playing ? <Pause size={28} strokeWidth={2.6} /> : <Volume2 size={28} strokeWidth={2.6} />}</button>
      <div className="flex-1 min-w-0">
        <div className="font-black text-[1.1rem]">{playing ? 'Reading to you' : 'Read to me'}</div>
        <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}><div className="h-full rounded-full" style={{ width: `${(step / total) * 100}%`, background: 'var(--teal)' }} /></div>
        <div className="mt-1 text-[0.85rem] font-bold" style={{ color: 'var(--teal)' }}>Step {step} of {total}</div>
      </div>
      <button onClick={() => { slower() }} className="flex-none btn h-11 min-h-0 text-[0.95rem]" style={{ background: 'transparent', color: '#fff', boxShadow: 'inset 0 0 0 2px var(--teal)' }}><Square size={14} className="hidden" />Slower</button>
    </div>
  )
}

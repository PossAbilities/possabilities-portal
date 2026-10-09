import { Check, LogOut } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { tap } from '../lib/sound'
import type { Settings as S } from '../lib/types'
import { Shell, Main } from '../components/Shell'
import { SectionHeader } from '../components/SectionHeader'

/** Settings with a live preview. Every change applies instantly so people can see what it does. */
export function Settings() {
  const { settings, updateSettings, signOut, profile } = useApp()
  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="card p-5 md:p-6 flex flex-col gap-4"><h2 className="h-display m-0 text-[1.4rem]">{title}</h2>{children}</section>
  const Opt = ({ on, onClick, children, label }: { on: boolean; onClick: () => void; children: React.ReactNode; label: string }) => (
    <button aria-pressed={on} onClick={onClick} className="choice min-h-[92px] rounded-[26px] border-0 flex flex-col items-center justify-center gap-1 font-black text-[1.05rem]" style={{ background: 'var(--card)', color: 'var(--ink)', boxShadow: on ? 'inset 0 0 0 4px var(--pink)' : 'inset 0 0 0 2px var(--lilac)' }}>
      {children}<span className="flex items-center gap-1">{label}{on && <Check size={16} strokeWidth={3} className="rounded-full p-[2px]" style={{ background: 'var(--teal)' }} />}</span>
    </button>
  )
  const Toggle = ({ k, label, hint }: { k: 'read_aloud' | 'pictures' | 'simplified' | 'sounds' | 'reduce_motion'; label: string; hint: string }) => (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 min-h-[84px] py-3 border-t-2" style={{ borderColor: 'var(--lilac)' }}>
      <span className="block text-[1.25rem] font-black leading-tight">{label}</span>
      <button role="switch" aria-checked={settings[k]} aria-label={label} onClick={() => { tap(); updateSettings({ [k]: !settings[k] }) }} className="w-16 h-9 rounded-full border-0 relative flex-none" style={{ background: settings[k] ? 'var(--purple)' : 'var(--lilac)' }}>
        <span className="absolute top-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ left: settings[k] ? 32 : 4, background: settings[k] ? 'var(--teal)' : '#fff', color: 'var(--purple)', transition: 'left var(--t-mid) var(--ease), background-color var(--t-mid) var(--ease)' }}>{settings[k] && <Check size={16} strokeWidth={3.2} />}</span>
      </button>
      <span className="block font-bold" style={{ color: 'var(--mute)' }}>{hint}</span>
      <span className="font-black text-right text-[0.95rem]" style={{ color: 'var(--mute)' }}>{settings[k] ? 'On' : 'Off'}</span>
    </div>
  )
  const Swatch = ({ a, b }: { a: string; b: string }) => <span className="w-14 h-7 rounded-full overflow-hidden flex" style={{ boxShadow: 'inset 0 0 0 2px var(--purple)' }}><span className="flex-1" style={{ background: a }} /><span className="flex-1" style={{ background: b }} /></span>
  return (
    <Shell>
      <SectionHeader section="learn" title={<><span className="md:hidden">My settings</span><span className="hidden md:inline">Make it work for me</span></>} hideAvatar character={false} />
      <Main className="max-w-[760px]">
        <div className="card p-5 flex flex-col gap-1" style={{ background: 'var(--purple)', color: '#fff' }}>
          <span className="font-extrabold text-[0.95rem]" style={{ color: 'var(--teal)' }}>This is how it looks now</span>
          <span className="h-display text-[1.6rem]">Small Changes, Big Difference</span>
          <span className="text-[1.15rem] hide-when-simple">Watch the slides. They start with a short film.</span>
        </div>
        <Card title="Text size">
          <div className="grid grid-cols-3 gap-4">
            {(['small', 'medium', 'large'] as S['text_size'][]).map((t, i) => <Opt key={t} on={settings.text_size === t} onClick={() => updateSettings({ text_size: t })} label={t[0].toUpperCase() + t.slice(1)}><span className="h-display" style={{ fontSize: [20, 28, 36][i] }}>Aa</span></Opt>)}
          </div>
        </Card>
        <Card title="Colours">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Opt on={settings.theme === 'standard'} onClick={() => updateSettings({ theme: 'standard' })} label="Standard"><Swatch a="#48065A" b="#66CCCC" /></Opt>
            <Opt on={settings.theme === 'contrast'} onClick={() => updateSettings({ theme: 'contrast' })} label="High contrast"><Swatch a="#000" b="#fff" /></Opt>
            <Opt on={settings.theme === 'calm'} onClick={() => updateSettings({ theme: 'calm' })} label="Calm"><Swatch a="#E8E1EC" b="#CFE9E9" /></Opt>
            <Opt on={settings.theme === 'dark'} onClick={() => updateSettings({ theme: 'dark' })} label="Dark"><Swatch a="#1C0A24" b="#66CCCC" /></Opt>
          </div>
        </Card>
        <Card title="Help me">
          <Toggle k="read_aloud" label="Read aloud" hint="A Listen button on every page" />
          <Toggle k="pictures" label="Pictures with words" hint="A picture beside the words" />
          <Toggle k="simplified" label="Less on screen" hint="Show only the main things" />
          <Toggle k="reduce_motion" label="Less movement" hint="Things stay still instead of moving" />
          <Toggle k="sounds" label="Sounds" hint="A soft tap when you press things" />
        </Card>
        <button onClick={signOut} className="btn self-start mt-2" style={{ background: 'var(--card)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 2px var(--lilac)' }}><LogOut size={22} strokeWidth={2.6} />Sign out{profile?.first_name ? ` (${profile.first_name})` : ''}</button>
      </Main>
    </Shell>
  )
}

import { Play } from 'lucide-react'

/** Deterministic variety: same id, same picture, every visit. */
function hash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }

const PALETTES = [
  ['var(--purple)', 'var(--pink)', 'var(--teal)'],
  ['var(--pink)', 'var(--purple)', 'var(--teal)'],
  ['var(--teal)', 'var(--purple)', 'var(--pink)'],
  ['var(--purple)', 'var(--teal)', 'var(--pink)'],
]

/**
 * Brand artwork for content that has no picture yet: a gradient field, a soft sun, and two wave bands, varied by id.
 * When the sync brings a real image, MediaFrame shows that instead and this is never seen.
 */
export function Artwork({ seed, className = '' }: { seed: string; className?: string }) {
  const h = hash(seed); const [a, b, c] = PALETTES[h % PALETTES.length]
  const sunX = 25 + (h >> 4) % 50, sunY = 18 + (h >> 9) % 30, sunR = 22 + (h >> 13) % 18
  const w1 = 95 + (h >> 17) % 40, w2 = 125 + (h >> 21) % 40
  return (
    <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" className={`block w-full h-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`g-${h}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <radialGradient id={`s-${h}`}><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="300" height="190" fill={`url(#g-${h})`} />
      <circle className="art-sun" cx={sunX * 3} cy={sunY * 1.9} r={sunR * 2.2} fill={`url(#s-${h})`} />
      <path d={`M0 190V${w2}C60 ${w2 - 30} 110 ${w2 + 20} 160 ${w2 - 6}C210 ${w2 - 32} 250 ${w2 - 2} 300 ${w2 - 24}V190Z`} fill={b} opacity="0.55" />
      <path d={`M0 190V${w1 + 50}C50 ${w1 + 30} 100 ${w1 + 62} 150 ${w1 + 56}C200 ${w1 + 50} 250 ${w1 + 20} 300 ${w1 + 42}V190Z`} fill={c} />
    </svg>
  )
}

/** Picture frame for a card: the real image when there is one, brand artwork when not, with a readable foot for text. */
export function MediaFrame({ src, seed, className = '', play = false, children, foot = !!children }: { src?: string | null; seed: string; className?: string; play?: boolean; children?: React.ReactNode; foot?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: 'var(--purple)' }}>
      {src ? <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0"><Artwork seed={seed} /></div>}
      {foot && <div className="absolute inset-x-0 bottom-0 h-[70%]" style={{ background: 'linear-gradient(to top, rgba(36,5,48,0.86), rgba(36,5,48,0.35) 55%, transparent)' }} />}
      {play && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--pink)', boxShadow: '0 8px 24px rgba(36,5,48,0.35)' }}><Play size={30} strokeWidth={3} fill="currentColor" /></span>}
      {children && <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">{children}</div>}
    </div>
  )
}

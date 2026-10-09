import { Play } from 'lucide-react'
/** Branded video poster used when a video has no artwork: title on purple with the wave. */
export function Poster({ title, playButton = false, compact = false, className }: { title: string; playButton?: boolean; compact?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] ${className ?? ''}`} style={{ background: 'var(--purple)', color: '#fff' }} aria-hidden="true">
      <svg viewBox="0 0 300 190" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path d="M0 190V128C40 112 90 132 150 142C210 152 260 126 300 108V190Z" fill="var(--pink)" />
        <path d="M0 190V156C50 140 100 160 160 166C220 172 262 150 300 136V190Z" fill="var(--teal)" />
      </svg>
      <div className={`relative flex gap-3 ${compact ? 'items-center justify-center h-full' : 'items-start justify-between p-4'}`}>
        {!compact && <span className="h-display text-[clamp(1.2rem,6vw,1.8rem)] whitespace-pre-line">{title}</span>}
        {playButton && <span className={`flex-none rounded-full bg-white flex items-center justify-center ${compact ? 'w-11 h-11' : 'w-12 h-12'}`} style={{ color: 'var(--pink)' }}><Play size={compact ? 22 : 24} strokeWidth={3} fill="currentColor" /></span>}
      </div>
    </div>
  )
}

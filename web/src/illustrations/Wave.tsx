/** One long asymmetric S-curve, a rim colour riding behind the front colour. Brand wave motif. */
export function WaveEdge({ front, rim, h = 70, className = '' }: { front: string; rim: string; h?: number; className?: string }) {
  const w = 390
  const f = `M0 0H${w}V26 C${w * 0.86} 70 ${w * 0.62} 58 ${w * 0.44} 32 C${w * 0.28} 8 ${w * 0.12} 10 0 42Z`
  const r = `M0 0H${w}V40 C${w * 0.86} 84 ${w * 0.62} 74 ${w * 0.44} 48 C${w * 0.28} 24 ${w * 0.12} 28 0 58Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" className={className}
      style={{ display: 'block', position: 'absolute', left: 0, right: 0, bottom: -h + 2, width: '100%', height: h }}>
      <path d={r} fill={rim} /><path d={f} fill={front} />
    </svg>
  )
}

/** Hero wave for the Home header on tablet and desktop: pink and teal bands the people stand on. */
export function HeroWave({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute left-0 right-0 bottom-0 h-[120px] lg:h-[190px] pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1280 190" preserveAspectRatio="none" className="absolute inset-0 w-full h-full"><path d="M0 190V100C220 40 380 120 620 96C860 72 1040 8 1280 52V190Z" fill="var(--pink)" /></svg>
      <svg viewBox="0 0 1280 150" preserveAspectRatio="none" className="absolute left-0 right-0 bottom-0 w-full h-[79%]"><path d="M0 150V92C260 40 420 124 700 100C940 80 1100 30 1280 70V150Z" fill="var(--teal)" /></svg>
    </div>
  )
}

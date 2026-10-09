export function Logo({ dark = false, size = 22, stacked = false }: { dark?: boolean; size?: number; stacked?: boolean }) {
  const a = dark ? '#FFFFFF' : 'var(--pink)', b = dark ? 'var(--teal)' : 'var(--purple)'
  return (
    <span aria-label="PossAbilities" className="h-display inline-flex" style={{ fontSize: size, flexDirection: stacked ? 'column' : 'row', lineHeight: 1 }}>
      <span style={{ color: a }}>Poss</span><span style={{ color: b }}>Abilities</span>
    </span>
  )
}

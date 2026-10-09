/**
 * The world behind a header: two soft glows in the section's rim colour, a film of grain so colour reads as printed
 * rather than painted, and a fade at the foot that melts into the sheet below. Pure CSS, no assets.
 */
export function Atmosphere({ rim, strength = 1 }: { rim: string; strength?: number }) {
  return (
    <div className="atmos" aria-hidden="true" style={{ ['--rim' as string]: rim, ['--atmos' as string]: strength }}>
      <span className="atmos-glow atmos-glow-a" /><span className="atmos-glow atmos-glow-b" />
      <span className="atmos-grain" />
    </div>
  )
}

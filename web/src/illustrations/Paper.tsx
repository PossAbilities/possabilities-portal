/** Easy Read document icon: a page with a picture and two lines. */
export function Paper({ w = 52 }: { w?: number }) {
  const h = Math.round(w * 1.3)
  return (
    <svg width={w} height={h} viewBox="0 0 52 68" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <rect x="1" y="1" width="50" height="66" rx="8" fill="#fff" stroke="var(--purple)" strokeWidth="2" />
      <rect x="9" y="9" width="34" height="22" rx="4" fill="var(--teal)" /><rect x="9" y="38" width="34" height="5" rx="2.5" fill="var(--purple)" /><rect x="9" y="48" width="24" height="5" rx="2.5" fill="var(--lilac)" />
    </svg>
  )
}

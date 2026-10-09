import { useEffect, useState } from 'react'
import { Crowd } from './People'
/**
 * The PossAbilities characters (Billy, Luca, Orla, Eliza, Nadia), generated in Magnific from the library characters
 * and saved as /characters/hero.png (transparent). Falls back to the drawn crowd if the file isn't there yet.
 */
export function Hero({ className = '', pose, crop = true }: { className?: string; pose?: string; crop?: boolean }) {
  const [missing, setMissing] = useState(false); const [src, setSrc] = useState(pose ? `hero-${pose}` : 'hero')
  useEffect(() => { setSrc(pose ? `hero-${pose}` : 'hero') }, [pose])
  if (missing) return <Crowd hills={false} />
  if (!crop) return <img key={src} src={`${import.meta.env.BASE_URL}characters/${src}.png`} alt="" className={`hero-float pose-swap block w-full h-full object-contain object-bottom ${className}`} onError={() => (src === 'hero' ? setMissing(true) : setSrc('hero'))} />
  return (
    <div className={`art-crop hero-float inset-0 ${className}`}>
      <img key={src} src={`${import.meta.env.BASE_URL}characters/${src}.png`} alt="" className="pose-swap" onError={() => (src === 'hero' ? setMissing(true) : setSrc('hero'))} />
    </div>
  )
}

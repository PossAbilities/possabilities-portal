import { useEffect, useState } from 'react'

/** Individual PossAbilities characters, generated in Magnific and saved as /characters/<name>.png (transparent, 3:4). */
export type CharacterName = 'billy' | 'luca' | 'orla' | 'eliza' | 'nadia'

/** Which character fronts which section. */
export const SECTION_CHARACTER: Record<string, CharacterName> = { home: 'billy', learn: 'luca', news: 'orla', videos: 'eliza', groups: 'nadia' }

/**
 * Poses are extra files: /characters/<name>-<pose>.png. If one hasn't been drawn yet the base picture shows,
 * so the app never shows a gap while the pack is being completed. See public/characters/PROMPTS.md.
 */
export function Character({ name, pose, height = 120, className = '' }: { name: CharacterName; pose?: string; height?: number; className?: string }) {
  const want = pose ? `${name}-${pose}` : name
  const [src, setSrc] = useState(want)
  useEffect(() => { setSrc(want) }, [want])
  if (src === '') return null
  return (
    <img key={src} src={`${import.meta.env.BASE_URL}characters/${src}.png`} alt="" aria-hidden
      onError={() => setSrc(src === name ? '' : name)}
      style={{ height }} className={`pose-swap block w-auto object-contain object-bottom select-none pointer-events-none ${className}`} />
  )
}

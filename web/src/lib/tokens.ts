export type SectionKey = 'home' | 'news' | 'learn' | 'videos' | 'groups'
/** Colour-per-section: header, active tab and cards share a colour so people can navigate by colour. */
export const SECTION: Record<SectionKey, { bg: string; fg: string; rim: string; label: string }> = {
  home:   { bg: 'var(--purple)', fg: 'var(--on-purple)', rim: 'var(--pink)',   label: 'Home' },
  news:   { bg: 'var(--pink)',   fg: '#FFFFFF',          rim: 'var(--purple)', label: 'News' },
  learn:  { bg: 'var(--teal)',   fg: 'var(--purple)',    rim: 'var(--purple)', label: 'Learn' },
  videos: { bg: 'var(--purple)', fg: 'var(--on-purple)', rim: 'var(--teal)',   label: 'Videos' },
  groups: { bg: 'var(--lilac)',  fg: 'var(--purple)',    rim: 'var(--purple)', label: 'Groups' },
}
export const SKIN = ['#FBE3C6', '#E8B88A', '#C98B5E', '#8A5636', '#5B3622']

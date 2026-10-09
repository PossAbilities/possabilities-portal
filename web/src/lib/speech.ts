/** Read-aloud using the browser's built-in voices. No network, no cost. */
let current: SpeechSynthesisUtterance | null = null
let rate = 0.95
export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window
export function speak(text: string, onEnd?: () => void) {
  if (!speechSupported()) return
  stop()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'; u.rate = rate
  const v = speechSynthesis.getVoices().find(v => v.lang === 'en-GB') ; if (v) u.voice = v
  u.onend = () => { current = null; onEnd?.() }
  current = u; speechSynthesis.speak(u)
}
export function stop() { if (speechSupported()) speechSynthesis.cancel(); current = null }
export function slower() { rate = Math.max(0.6, rate - 0.15) }
export function isSpeaking() { return !!current }

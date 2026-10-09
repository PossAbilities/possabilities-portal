/**
 * Tiny synthesised sounds, no files, no network. Off unless the person turns "Sounds" on in Settings.
 * Everything is gentle and short: a tap you feel more than hear, a two-note chime for finishing something.
 */
let ctx: AudioContext | null = null
let enabled = false
export function setSoundsEnabled(on: boolean) { enabled = on }

function ac() {
  if (!ctx) { const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; if (!C) return null; ctx = new C() }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}
function tone(freq: number, at: number, dur: number, gain = 0.08, type: OscillatorType = 'sine') {
  const c = ac(); if (!c) return
  const o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + at)
  g.gain.setValueAtTime(0.0001, c.currentTime + at)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur)
  o.connect(g).connect(c.destination); o.start(c.currentTime + at); o.stop(c.currentTime + at + dur + 0.05)
}
/** Soft tap: tab change, switch flipped. */
export function tap() { if (!enabled) return; tone(660, 0, 0.09, 0.05, 'triangle') }
/** Finished something: two rising notes. */
export function chime() { if (!enabled) return; tone(523.25, 0, 0.32, 0.07); tone(783.99, 0.14, 0.42, 0.07) }

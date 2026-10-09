/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: 'var(--purple)', teal: 'var(--teal)', pink: 'var(--pink)',
        ink: 'var(--ink)', mute: 'var(--mute)', ground: 'var(--ground)',
        lilac: 'var(--lilac)', tintk: 'var(--tint-pink)', tintt: 'var(--tint-teal)', card: 'var(--card)'
      },
      fontFamily: { sans: ['"Nunito Sans"', 'Avenir', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '28px', pill: '999px' },
      boxShadow: { card: '0 2px 0 rgba(36,5,48,0.06), 0 8px 24px rgba(36,5,48,0.10)' }
    }
  },
  plugins: []
}

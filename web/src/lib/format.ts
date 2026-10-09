const dtf = new Intl.DateTimeFormat('en-GB', { weekday: 'long', hour: 'numeric', minute: '2-digit' })
const dayf = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
export const whenShort = (iso: string | null) => (iso ? dtf.format(new Date(iso)) : '')
export const whenDay = (iso: string | null) => (iso ? dayf.format(new Date(iso)) : '')
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' }

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { demoClient } from './demo'

/** VITE_DEMO=1 swaps in an in-memory stand-in so the app runs with no backend (preview links, design reviews). */
export const DEMO = import.meta.env.VITE_DEMO === '1'
const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
if (!DEMO && (!url || !key)) console.warn('Supabase env vars missing; copy web/.env.example to web/.env')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = (DEMO ? demoClient : createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })) as unknown as SupabaseClient<any, 'public', any>

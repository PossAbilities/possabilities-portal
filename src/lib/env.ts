/**
 * False while the Supabase env vars are still the placeholders, so the app
 * renders with in-memory seed data until real project keys are added.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("placeholder");
}

/**
 * False while the Supabase env vars are still the placeholders, so the app
 * renders with in-memory seed data until real project keys are added.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("placeholder");
}

/** True when the Apple Wallet signing material + IDs are present. */
export function isAppleWalletConfigured(): boolean {
  return !!(
    process.env.APPLE_PASS_TYPE_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_PASS_CERT_B64 &&
    process.env.APPLE_PASS_KEY_B64 &&
    process.env.APPLE_WWDR_B64
  );
}

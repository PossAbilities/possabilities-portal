import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { signOut } from "@/lib/auth-actions";
import { Icon } from "@/components/Icon";

export default async function AdminSettingsPage() {
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <>
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-stack-sm">
        Settings
      </h1>
      <p className="font-statement-text text-statement-text text-on-surface-variant max-w-2xl mb-stack-md">
        Manage your admin account.
      </p>

      <section className="bg-surface-white border-2 border-outline-variant rounded-xl p-6 max-w-xl">
        <h2 className="font-headline-md text-[22px] text-brand-purple mb-4 flex items-center gap-3">
          <Icon name="account_circle" className="text-brand-teal" /> Your account
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-purple text-on-primary flex items-center justify-center">
            <Icon name="person" fill />
          </div>
          <div className="min-w-0">
            <p className="font-label-bold text-label-bold">Signed in as</p>
            <p className="font-body-md text-body-md text-on-surface-variant truncate">
              {email || "Admin (connect Supabase auth to show your email)"}
            </p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="btn min-h-touch-target-min px-6 bg-white border-2 border-error text-error rounded-xl font-label-bold text-label-bold hover:bg-error hover:text-on-error"
          >
            <Icon name="logout" /> Sign out
          </button>
        </form>
      </section>

      <section className="mt-stack-md bg-surface-container-low border-2 border-dashed border-brand-purple rounded-xl p-6 max-w-xl">
        <h2 className="font-headline-md text-[22px] text-brand-purple mb-2 flex items-center gap-3">
          <Icon name="tune" className="text-brand-pink" /> More settings
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-[1.7]">
          Portal preferences and user management will appear here. Let us know what controls you&apos;d
          find most useful.
        </p>
      </section>
    </>
  );
}

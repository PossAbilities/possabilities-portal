"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { signIn } from "@/lib/auth-actions";
import { Icon } from "@/components/Icon";

const fieldClass =
  "w-full h-touch-target-min border-2 border-outline rounded-xl px-4 font-body-md text-body-md text-on-surface bg-surface-white";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await signIn(email, password);
      if (res.ok) {
        const dest = params.get("redirectedFrom") || "/admin";
        router.replace(dest.startsWith("/admin") ? dest : "/admin");
        router.refresh();
      } else {
        setError(res.error || "Sign in failed.");
      }
    });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-margin-side py-stack-lg bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-stack-md">
          <span className="font-headline-md text-headline-md font-black text-brand-purple">PossAbilities</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Admin access only</p>
        </div>

        <div className="bg-surface-white border-2 border-brand-purple rounded-2xl easy-read-shadow p-stack-md">
          <div className="w-16 h-16 rounded-full bg-brand-purple flex items-center justify-center mx-auto mb-stack-sm">
            <Icon name="lock" size={28} className="text-brand-teal" />
          </div>
          <h1 className="font-headline-md text-headline-md text-brand-purple text-center">Admin Sign In</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2 mb-stack-sm">
            Enter your details to open the dashboard.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block font-label-bold text-label-bold text-brand-purple mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@possabilities.org.uk"
                autoComplete="username"
                required
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-label-bold text-label-bold text-brand-purple mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className={fieldClass}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 bg-error-container text-on-error-container rounded-xl px-4 py-3 font-label-bold text-label-bold"
              >
                <Icon name="error" fill className="shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full min-h-touch-target-min bg-brand-pink text-on-primary rounded-xl px-6 font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-secondary active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Icon name="login" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-stack-sm flex items-center justify-center gap-2 font-label-bold text-label-bold text-brand-purple hover:underline"
        >
          <Icon name="arrow_back" />
          Back to PossAbilities Portal
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { signIn } from "@/lib/auth-actions";
import { Icon } from "@/components/Icon";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #80737f",
  borderRadius: "4px",
  background: "#fff",
  fontSize: "15px",
  color: "#1e1b1c",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  color: "#290036",
  fontSize: "12px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: "7px",
};

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
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#fff8f8" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "28px", fontWeight: 800, color: "#290036", letterSpacing: "-0.01em" }}>
            PossAbilities
          </span>
          <p style={{ color: "#4e434e", margin: "8px 0 0", fontSize: "15px" }}>Admin access only</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #d1c2cf", borderRadius: "8px", padding: "36px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "9999px",
              background: "#48065a",
              margin: "0 auto 24px",
            }}
          >
            <Icon name="lock" size={28} style={{ color: "#5BC3C3" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#290036", margin: "0 0 6px", textAlign: "center" }}>
            Admin Sign In
          </h1>
          <p style={{ color: "#4e434e", fontSize: "14px", textAlign: "center", margin: "0 0 28px" }}>
            Enter your credentials to access the dashboard.
          </p>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@possabilities.org.uk"
                autoComplete="username"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={inputStyle}
              />
            </div>
            {error && (
              <p style={{ margin: 0, color: "#ba1a1a", fontSize: "14px", fontWeight: 600, background: "#ffdad6", padding: "10px 14px", borderRadius: "4px" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="btn btn-pink-deep"
              style={{ width: "100%", padding: "15px", fontSize: "16px", marginTop: "4px" }}
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
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

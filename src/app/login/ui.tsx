"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = useMemo(() => params.get("next") ?? "", [params]);

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error ?? "ログインに失敗しました");
      return;
    }

    const data = await res.json();
    if (nextPath) router.push(nextPath);
    else router.push(data.role === "admin" ? "/admin" : "/buddy");
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 360 }}>
      <label style={{ display: "grid", gap: 4 }}>
        <span>メール</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label style={{ display: "grid", gap: 4 }}>
        <span>パスワード</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>

      <button disabled={loading} type="submit">
        {loading ? "ログイン中..." : "ログイン"}
      </button>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
    </form>
  );
}

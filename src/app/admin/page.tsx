import Link from "next/link";
import { requireAdmin } from "@/lib/serverAuth";

export default async function AdminHome() {
  const admin = await requireAdmin();

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>管理画面</h1>
          <p style={{ color: "#666" }}>{admin.email}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <form action="/api/auth/logout" method="post">
            <button type="submit">ログアウト</button>
          </form>
          <Link href="/">ホーム</Link>
        </div>
      </header>

      <ul style={{ paddingLeft: 18, marginTop: 18 }}>
        <li>
          <Link href="/admin/events">イベント管理</Link>
        </li>
        <li>
          <Link href="/admin/buddies">バディユーザー管理</Link>
        </li>
        <li>
          <Link href="/admin/assignments">割り当て管理</Link>
        </li>
      </ul>
    </main>
  );
}

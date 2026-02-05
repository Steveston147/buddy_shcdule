import Link from "next/link";
import { requireUser } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export default async function BuddyPage() {
  const user = await requireUser();
  const assignments = jsondb.listAssignmentsForUser(user.id);

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>バディ画面</h1>
          <p style={{ color: "#666" }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <form action="/api/auth/logout" method="post">
            <button type="submit">ログアウト</button>
          </form>
          <Link href="/">ホーム</Link>
        </div>
      </header>

      <h2 style={{ marginTop: 20 }}>自分に割り当てられたイベント（近い順）</h2>

      {assignments.length === 0 ? (
        <p>割り当てられたイベントがありません。</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {assignments.map((a) => (
            <li key={a.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{a.event.title}</div>
              <div>種別: {a.event.type === "culture" ? "文化体験" : "日本語講座"}</div>
              <div>日時: {new Date(a.event.startAt).toLocaleString("ja-JP")}</div>
              <div>集合場所: {a.event.meetingPlace}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

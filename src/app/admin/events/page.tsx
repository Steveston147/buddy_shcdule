import Link from "next/link";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";
import AdminEventsClient from "./ui";

export default async function AdminEventsPage() {
  await requireAdmin();
  const events = jsondb.listEvents();

  return (
    <main>
      <h1>イベント管理</h1>
      <p>
        <Link href="/admin">← 管理トップ</Link>
      </p>

      <AdminEventsClient initialEvents={events} />
    </main>
  );
}

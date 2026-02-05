import Link from "next/link";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";
import AdminAssignmentsClient from "./ui";

export default async function AdminAssignmentsPage() {
  await requireAdmin();
  const events = jsondb.listEvents();
  const buddies = jsondb.listBuddies().map((b) => ({ id: b.id, email: b.email }));

  return (
    <main>
      <h1>割り当て管理</h1>
      <p>
        <Link href="/admin">← 管理トップ</Link>
      </p>

      <AdminAssignmentsClient events={events} buddies={buddies} />
    </main>
  );
}

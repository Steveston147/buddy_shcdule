import Link from "next/link";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";
import AdminBuddiesClient from "./ui";

export default async function AdminBuddiesPage() {
  await requireAdmin();
  const buddies = jsondb.listBuddies();

  return (
    <main>
      <h1>バディユーザー管理</h1>
      <p>
        <Link href="/admin">← 管理トップ</Link>
      </p>

      <AdminBuddiesClient initialBuddies={buddies.map((b) => ({ id: b.id, email: b.email, role: b.role }))} />
    </main>
  );
}

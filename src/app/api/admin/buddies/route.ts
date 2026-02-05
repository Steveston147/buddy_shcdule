import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function GET() {
  await requireAdmin();
  const buddies = jsondb.listBuddies();
  return NextResponse.json({
    buddies: buddies.map((b) => ({ id: b.id, email: b.email, role: b.role }))
  });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = (await req.json().catch(() => ({}))) as any;

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "email と password が必要です" }, { status: 400 });
  }

  try {
    const created = jsondb.createBuddy(email, password);
    return NextResponse.json({ buddy: { id: created.id, email: created.email, role: created.role } });
  } catch (e: any) {
    if (String(e?.message) === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "そのメールは既に存在します" }, { status: 409 });
    }
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}

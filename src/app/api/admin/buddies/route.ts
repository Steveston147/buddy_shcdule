export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function GET() {
  try {
    await requireAdmin();
    const buddies = jsondb.listBuddies();
    return NextResponse.json({
      buddies: buddies.map((b) => ({ id: b.id, email: b.email, role: b.role }))
    });
  } catch (e: any) {
    console.error("[admin/buddies GET] error:", e);
    return NextResponse.json({ error: "サーバー内部エラー", detail: String(e?.message ?? e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
      throw e;
    }
  } catch (e: any) {
    console.error("[admin/buddies POST] error:", e);
    return NextResponse.json({ error: "サーバー内部エラー", detail: String(e?.message ?? e) }, { status: 500 });
  }
}

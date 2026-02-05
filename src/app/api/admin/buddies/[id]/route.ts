export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    try {
      jsondb.deleteBuddy(id);
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      if (String(e?.message) === "CANNOT_DELETE_ADMIN") {
        return NextResponse.json({ error: "adminは削除できません" }, { status: 400 });
      }
      throw e;
    }
  } catch (e: any) {
    console.error("[admin/buddies/:id DELETE] error:", e);
    return NextResponse.json({ error: "サーバー内部エラー", detail: String(e?.message ?? e) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;

  const body = (await req.json().catch(() => ({}))) as any;

  const patch: any = {};
  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.type !== undefined) patch.type = body.type === "japanese" ? "japanese" : "culture";
  if (body.meetingPlace !== undefined) patch.meetingPlace = String(body.meetingPlace).trim();
  if (body.startAt !== undefined) {
    const d = new Date(String(body.startAt));
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "開始日時が不正です" }, { status: 400 });
    patch.startAt = d.toISOString();
  }

  const updated = jsondb.updateEvent(id, patch);
  return NextResponse.json({ event: updated });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  jsondb.deleteEvent(id);
  return NextResponse.json({ ok: true });
}

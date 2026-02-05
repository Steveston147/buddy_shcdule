import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function GET(req: Request) {
  await requireAdmin();

  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  if (!eventId) return NextResponse.json({ error: "eventId が必要です" }, { status: 400 });

  return NextResponse.json({ userIds: jsondb.getAssignedUserIds(eventId) });
}

export async function POST(req: Request) {
  await requireAdmin();

  const body = (await req.json().catch(() => ({}))) as any;
  const eventId = String(body.eventId ?? "");
  const userIds = Array.isArray(body.userIds) ? body.userIds.map(String) : [];

  if (!eventId) return NextResponse.json({ error: "eventId が必要です" }, { status: 400 });

  jsondb.setAssignmentsForEvent(eventId, userIds);
  return NextResponse.json({ ok: true });
}

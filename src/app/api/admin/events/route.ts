import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { jsondb } from "@/lib/jsondb";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ events: jsondb.listEvents() });
}

export async function POST(req: Request) {
  await requireAdmin();

  const body = (await req.json().catch(() => ({}))) as any;
  const title = String(body.title ?? "").trim();
  const type = body.type === "japanese" ? "japanese" : "culture";
  const startAt = String(body.startAt ?? "");
  const meetingPlace = String(body.meetingPlace ?? "").trim();

  if (!title || !startAt || !meetingPlace) {
    return NextResponse.json({ error: "タイトル/開始日時/集合場所は必須です" }, { status: 400 });
  }

  const d = new Date(startAt);
  if (Number.isNaN(d.getTime())) {
    return NextResponse.json({ error: "開始日時が不正です" }, { status: 400 });
  }

  const e = jsondb.createEvent({
    title,
    type,
    startAt: d.toISOString(),
    meetingPlace
  });

  return NextResponse.json({ event: e });
}

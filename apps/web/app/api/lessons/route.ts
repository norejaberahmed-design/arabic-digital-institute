import { NextResponse } from "next/server";
import { prisma } from "@adi/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ level: { position: "asc" } }, { position: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        objective: true,
        durationMin: true,
        level: { select: { code: true, title: true } },
      },
    });
    return NextResponse.json({ data: lessons });
  } catch {
    return NextResponse.json(
      { error: "LESSONS_UNAVAILABLE", message: "The lesson database is not configured yet." },
      { status: 503 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@adi/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        objective: true,
        durationMin: true,
        content: true,
        level: { select: { code: true, title: true } },
      },
    });
    if (!lesson) {
      return NextResponse.json({ error: "LESSON_NOT_FOUND" }, { status: 404 });
    }

    const content = lesson.content as {
      sections?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    };
    const safeContent = {
      ...content,
      sections: content.sections?.map(({ answer: _answer, ...section }) => section) ?? [],
    };
    return NextResponse.json({ data: { ...lesson, content: safeContent } });
  } catch {
    return NextResponse.json(
      { error: "LESSONS_UNAVAILABLE", message: "The lesson database is not configured yet." },
      { status: 503 },
    );
  }
}

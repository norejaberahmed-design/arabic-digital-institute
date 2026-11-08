import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@adi/database";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function currentLearner() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  return prisma.learnerProfile.upsert({
    where: { authSubject: session.user.id },
    create: { authSubject: session.user.id, displayName: session.user.name },
    update: { displayName: session.user.name },
  });
}

export async function GET() {
  try {
    const learner = await currentLearner();
    if (!learner) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const progress = await prisma.lessonProgress.findMany({
      where: { learnerId: learner.id },
      select: { lessonId: true, completed: true, lastPosition: true, completedAt: true, updatedAt: true, lesson: { select: { slug: true, title: true, level: { select: { code: true } } } } },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ data: progress });
  } catch {
    return NextResponse.json({ error: "PROGRESS_UNAVAILABLE" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const learner = await currentLearner();
    if (!learner) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.lessonSlug !== "string" || input.lessonSlug.length > 120) {
      return NextResponse.json({ error: "INVALID_LESSON" }, { status: 400 });
    }

    const lesson = await prisma.lesson.findFirst({
      where: { slug: input.lessonSlug, status: "PUBLISHED" },
      select: { id: true, content: true },
    });
    if (!lesson) return NextResponse.json({ error: "LESSON_NOT_FOUND" }, { status: 404 });

    if (input.action === "complete") {
      await prisma.lessonProgress.upsert({
        where: { learnerId_lessonId: { learnerId: learner.id, lessonId: lesson.id } },
        create: { learnerId: learner.id, lessonId: lesson.id, completed: true, completedAt: new Date() },
        update: { completed: true, completedAt: new Date() },
      });
      return NextResponse.json({ data: { completed: true } });
    }

    if (input.action === "position") {
      const position = input.position;
      if (typeof position !== "number" || !Number.isInteger(position) || position < 0 || position > 100) {
        return NextResponse.json({ error: "INVALID_POSITION" }, { status: 400 });
      }
      const progress = await prisma.lessonProgress.upsert({
        where: { learnerId_lessonId: { learnerId: learner.id, lessonId: lesson.id } },
        create: { learnerId: learner.id, lessonId: lesson.id, lastPosition: position },
        update: { lastPosition: position },
        select: { lastPosition: true, completed: true },
      });
      return NextResponse.json({ data: progress });
    }

    if (input.action === "attempt") {
      if (typeof input.activityId !== "string" || input.activityId.length > 120 ||
          typeof input.answer !== "string" || input.answer.length > 200) {
        return NextResponse.json({ error: "INVALID_ATTEMPT" }, { status: 400 });
      }
      const content = lesson.content as { sections?: Array<{ id?: string; type?: string; answer?: string; explanation?: string }> };
      const activity = content.sections?.find(section => section.id === input.activityId && section.type === "multiple-choice");
      if (!activity || !activity.answer) return NextResponse.json({ error: "ACTIVITY_NOT_FOUND" }, { status: 404 });
      const isCorrect = input.answer === activity.answer;
      const attempt = await prisma.activityAttempt.create({
        data: {
          learnerId: learner.id,
          lessonId: lesson.id,
          activityId: input.activityId,
          answer: input.answer,
          isCorrect,
          feedback: isCorrect ? "Correct" : "Try again",
        },
        select: { id: true, isCorrect: true, createdAt: true },
      });
      return NextResponse.json({ data: { ...attempt, explanation: activity.explanation } });
    }

    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "PROGRESS_SAVE_FAILED" }, { status: 503 });
  }
}

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
      const sections = (lesson.content as { sections?: Array<{ id?: string; type?: string }> }).sections ?? [];
      const requiredActivityIds = Array.from(new Set(
        sections
          .filter(section => section.type === "multiple-choice" || section.type === "text-input")
          .map(section => section.id)
          .filter((id): id is string => typeof id === "string" && id.length > 0)
      ));

      if (requiredActivityIds.length > 0) {
        const successfulAttempts = await prisma.activityAttempt.findMany({
          where: {
            learnerId: learner.id,
            lessonId: lesson.id,
            activityId: { in: requiredActivityIds },
            isCorrect: true,
          },
          select: { activityId: true },
        });
        const satisfied = new Set(successfulAttempts.map(attempt => attempt.activityId));
        const remainingActivities = requiredActivityIds.filter(id => !satisfied.has(id));
        if (remainingActivities.length > 0) {
          return NextResponse.json({
            error: "LESSON_REQUIREMENTS_INCOMPLETE",
            remainingActivities: remainingActivities.length,
          }, { status: 409 });
        }
      }

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
      const activity = content.sections?.find(section =>
        section.id === input.activityId && (section.type === "multiple-choice" || section.type === "text-input")
      );
      if (!activity || typeof activity.answer !== "string") return NextResponse.json({ error: "ACTIVITY_NOT_FOUND" }, { status: 404 });
      const normalizeAnswer = (value: string) => value.normalize("NFC").replace(/ـ/g, "").trim();
      const isCorrect = normalizeAnswer(input.answer) === normalizeAnswer(activity.answer);
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

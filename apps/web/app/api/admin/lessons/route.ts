import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Prisma, prisma } from "@adi/database";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== "ADMIN") return { response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }) };
  return { userId: session.user.id };
}

function isValidLessonContent(value: unknown): value is Prisma.InputJsonValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const sections = (value as Record<string, unknown>).sections;
  if (!Array.isArray(sections) || sections.length === 0 || sections.length > 50) return false;

  return sections.every((section) => {
    if (!section || typeof section !== "object" || Array.isArray(section)) return false;
    const item = section as Record<string, unknown>;
    const supportedTypes = ["dialogue", "vocabulary", "multiple-choice", "reading", "writing", "letter-studio", "text-input"];
    if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > 120 ||
        typeof item.title !== "string" || item.title.length === 0 || item.title.length > 180 ||
        !supportedTypes.includes(String(item.type))) return false;

    if (item.type === "multiple-choice") {
      if (typeof item.prompt !== "string" || item.prompt.length === 0 || item.prompt.length > 1000 ||
          typeof item.answer !== "string" || !Array.isArray(item.options) ||
          item.options.length < 2 || item.options.length > 8) return false;
      const optionIds = item.options.map(option =>
        option && typeof option === "object" ? (option as Record<string, unknown>).id : undefined
      );
      return optionIds.every(id => typeof id === "string") &&
        new Set(optionIds).size === optionIds.length && optionIds.includes(item.answer) &&
        item.options.every(option => {
          if (!option || typeof option !== "object") return false;
          const candidate = option as Record<string, unknown>;
          return typeof candidate.label === "string" && candidate.label.length > 0 && candidate.label.length <= 300;
        });
    }

    if (item.type === "text-input") {
      return typeof item.prompt === "string" && item.prompt.length > 0 && item.prompt.length <= 1000 &&
        typeof item.answer === "string" && item.answer.length > 0 && item.answer.length <= 200 &&
        (item.inputTools === undefined || (Array.isArray(item.inputTools) &&
          item.inputTools.length <= 40 && item.inputTools.every(token => typeof token === "string" && token.length <= 12)));
    }

    if (item.type === "letter-studio") {
      return Array.isArray(item.letters) && item.letters.length > 0 && item.letters.length <= 40 &&
        item.letters.every(letter => {
          if (!letter || typeof letter !== "object") return false;
          const candidate = letter as Record<string, unknown>;
          return ["char", "name", "sound", "example", "meaning", "note"].every(key =>
            typeof candidate[key] === "string" && (candidate[key] as string).length > 0 && (candidate[key] as string).length <= 300
          ) && Array.isArray(candidate.forms) && candidate.forms.length === 4 &&
            candidate.forms.every(form => typeof form === "string" && form.length <= 20);
        });
    }

    if (item.type === "dialogue") {
      return Array.isArray(item.lines) && item.lines.length > 0 && item.lines.length <= 50 &&
        item.lines.every(line => {
          if (!line || typeof line !== "object") return false;
          const candidate = line as Record<string, unknown>;
          return ["speaker", "arabic", "transliteration", "english"].every(key =>
            typeof candidate[key] === "string" && (candidate[key] as string).length > 0 && (candidate[key] as string).length <= 500
          );
        });
    }

    if (item.type === "vocabulary" || item.type === "reading") {
      return Array.isArray(item.items) && item.items.length > 0 && item.items.length <= 100 &&
        item.items.every(entry => {
          if (!entry || typeof entry !== "object") return false;
          const candidate = entry as Record<string, unknown>;
          return ["arabic", "transliteration", "english"].every(key =>
            typeof candidate[key] === "string" && (candidate[key] as string).length > 0 && (candidate[key] as string).length <= 500
          );
        });
    }

    if (item.type === "writing") {
      return typeof item.prompt === "string" && item.prompt.length > 0 && item.prompt.length <= 1000;
    }

    return true;
  });
}

export async function GET() {
  try {
    const access = await requireAdmin();
    if ("response" in access) return access.response;
    const [lessons, levels] = await Promise.all([
      prisma.lesson.findMany({
        orderBy: [{ level: { position: "asc" } }, { position: "asc" }],
        select: { id: true, slug: true, title: true, status: true, summary: true, objective: true, durationMin: true, level: { select: { id: true, code: true, title: true } } },
      }),
      prisma.level.findMany({ orderBy: { position: "asc" }, select: { id: true, code: true, title: true } }),
    ]);
    return NextResponse.json({ data: { lessons, levels } });
  } catch {
    return NextResponse.json({ error: "ADMIN_DATA_UNAVAILABLE" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if ("response" in access) return access.response;
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const input = body as Record<string, unknown>;
    const slug = typeof input.slug === "string" ? input.slug.trim() : "";
    const title = typeof input.title === "string" ? input.title.trim() : "";
    const levelId = typeof input.levelId === "string" ? input.levelId : "";
    const summary = typeof input.summary === "string" ? input.summary.trim() : "";
    const objective = typeof input.objective === "string" ? input.objective.trim() : "";
    const durationMin = input.durationMin;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100 ||
        !title || title.length > 160 || !levelId || !summary || summary.length > 500 ||
        !objective || objective.length > 500 || typeof durationMin !== "number" ||
        !Number.isInteger(durationMin) || durationMin < 1 || durationMin > 180 ||
        !isValidLessonContent(input.content)) {
      return NextResponse.json({ error: "INVALID_LESSON_DATA" }, { status: 400 });
    }
    const level = await prisma.level.findUnique({ where: { id: levelId }, select: { id: true } });
    if (!level) return NextResponse.json({ error: "LEVEL_NOT_FOUND" }, { status: 404 });
    const lesson = await prisma.lesson.create({
      data: { levelId, slug, title, summary, objective, durationMin, position: 0, status: "DRAFT", content: input.content },
      select: { id: true, slug: true, title: true, status: true },
    });
    return NextResponse.json({ data: lesson }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "LESSON_CREATE_FAILED" }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdmin();
    if ("response" in access) return access.response;
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.id !== "string" || input.id.length > 100) return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
    const data: Prisma.LessonUpdateInput = {};
    if (typeof input.title === "string" && input.title.trim().length > 0 && input.title.length <= 160) data.title = input.title.trim();
    if (typeof input.summary === "string" && input.summary.length <= 500) data.summary = input.summary.trim();
    if (typeof input.objective === "string" && input.objective.length <= 500) data.objective = input.objective.trim();
    if (input.status === "DRAFT" || input.status === "REVIEW" || input.status === "PUBLISHED" || input.status === "ARCHIVED") data.status = input.status;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "NO_VALID_CHANGES" }, { status: 400 });
    const lesson = await prisma.lesson.update({ where: { id: input.id }, data, select: { id: true, title: true, status: true } });
    return NextResponse.json({ data: lesson });
  } catch {
    return NextResponse.json({ error: "LESSON_UPDATE_FAILED" }, { status: 404 });
  }
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@adi/database";
import LessonPlayer from "./lesson-player";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LessonContent = {
  sections?: Array<{
    id: string;
    type: string;
    title: string;
    lines?: Array<{ speaker: string; arabic: string; transliteration: string; english: string }>;
    items?: Array<{ arabic: string; transliteration: string; english: string }>;
    prompt?: string;
    options?: Array<{ id: string; label: string }>;
    answer?: string;
    explanation?: string;
  }>;
};

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { level: { select: { code: true, title: true } } },
  }).catch(() => null);

  if (!lesson) notFound();
  const content = lesson.content as LessonContent;

  return (
    <main className="shell lesson-shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">ع</span><span>المعهد الرقمي</span></Link>
        <Link className="language" href="/lessons">كل الدروس</Link>
      </header>
      <section className="lesson-heading">
        <span className="level-code">{lesson.level.code.replace("_", "-")}</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
        <div className="lesson-meta">{lesson.durationMin} دقائق · {lesson.objective}</div>
      </section>
      <LessonPlayer lessonSlug={lesson.slug} sections={(content.sections ?? []).map(({ answer, ...section }) => section)} />
    </main>
  );
}

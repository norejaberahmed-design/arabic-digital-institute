import Link from "next/link";
import { prisma } from "@adi/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  let lessons: Awaited<ReturnType<typeof prisma.lesson.findMany>> = [];
  let unavailable = false;
  try {
    lessons = await prisma.lesson.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ level: { position: "asc" } }, { position: "asc" }],
      include: { level: { select: { code: true, title: true } } },
    });
  } catch {
    unavailable = true;
  }

  return (
    <main className="shell lessons-shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">ع</span><span>المعهد الرقمي</span></Link>
        <Link className="language" href="/">الرئيسية</Link>
      </header>
      <section className="lessons-heading">
        <p className="section-kicker">PRE-A1 · BEGINNER</p>
        <h1>دروسك الأولى</h1>
        <p className="muted">تعلم عبارات عربية مفيدة من خلال مواقف قصيرة.</p>
      </section>
      {unavailable ? (
        <div className="system-message"><strong>قاعدة البيانات غير متصلة بعد.</strong><p>شغّل PostgreSQL، أضف DATABASE_URL، ثم نفّذ ترحيل قاعدة البيانات وأمر seed.</p></div>
      ) : lessons.length === 0 ? (
        <div className="system-message"><strong>لا توجد دروس منشورة حتى الآن.</strong><p>بعد إعداد قاعدة البيانات، شغّل أمر seed لإضافة الدرس الأول.</p></div>
      ) : (
        <section className="lesson-list">
          {lessons.map((lesson) => (
            <article className="lesson-list-card" key={lesson.id}>
              <div className="lesson-index">01</div>
              <div className="lesson-info">
                <span className="level-code">{lesson.level.code.replace("_", "-")}</span>
                <h2>{lesson.title}</h2>
                <p>{lesson.summary}</p>
                <span className="lesson-duration">{lesson.durationMin} دقائق · {lesson.objective}</span>
              </div>
              <Link className="level-link" href={`/lessons/${lesson.slug}`}>افتح الدرس ←</Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

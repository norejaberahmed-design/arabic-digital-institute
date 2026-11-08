"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Level = { id: string; code: string; title: string };
type Lesson = { id: string; slug: string; title: string; status: string; summary: string; objective: string; durationMin: number; level: { id: string; code: string; title: string } };

const starterContent = JSON.stringify({
  version: 1,
  language: "ar",
  instructionLanguage: "en",
  sections: [
    { id: "vocabulary", type: "vocabulary", title: "Useful words", items: [{ arabic: "مرحبا", transliteration: "marhaban", english: "Hello" }] },
    { id: "practice-1", type: "multiple-choice", title: "Practice", prompt: "Which word means Hello?", options: [{ id: "a", label: "مرحبا" }, { id: "b", label: "شكرا" }], answer: "a", explanation: "مرحبا means Hello." }
  ]
}, null, 2);

export default function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [levelId, setLevelId] = useState("");
  const [summary, setSummary] = useState("");
  const [objective, setObjective] = useState("");
  const [durationMin, setDurationMin] = useState(7);
  const [content, setContent] = useState(starterContent);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/lessons");
      if (!response.ok) throw new Error(response.status === 401 ? "سجّل الدخول بحساب مدير." : response.status === 403 ? "هذا القسم مخصص لمديري المعهد." : "تعذر تحميل بيانات الإدارة.");
      const result = await response.json() as { data: { lessons: Lesson[]; levels: Level[] } };
      setLessons(result.data.lessons);
      setLevels(result.data.levels);
      if (!levelId && result.data.levels[0]) setLevelId(result.data.levels[0].id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حدث خطأ.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const parsedContent = JSON.parse(content) as unknown;
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, levelId, summary, objective, durationMin, content: parsedContent }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر إنشاء الدرس.");
      setSlug(""); setTitle(""); setSummary(""); setObjective("");
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تحقق من صيغة محتوى الدرس.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    const response = await fetch("/api/admin/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) {
      setError("تعذر تحديث حالة الدرس.");
      return;
    }
    await refresh();
  }

  return (
    <main className="shell lessons-shell">
      <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">ع</span><span>المعهد الرقمي</span></Link><Link className="language" href="/dashboard">لوحة الطالب</Link></header>
      <section className="lessons-heading"><p className="section-kicker">INSTITUTE ADMINISTRATION</p><h1>إدارة المحتوى التعليمي</h1><p className="muted">أنشئ الدروس، راجعها، ثم انشرها للطلاب.</p></section>
      {error && <p className="answer-feedback incorrect" role="alert">{error}</p>}
      {loading ? <p className="muted">جارٍ تحميل لوحة الإدارة...</p> : !error && (
        <>
          <section className="admin-section">
            <h2>الدروس الحالية</h2>
            {lessons.map(lesson => <article className="admin-lesson" key={lesson.id}>
              <div><span className="level-code">{lesson.level.code.replace("_", "-")} · {lesson.status}</span><h3>{lesson.title}</h3><p className="muted">{lesson.slug}</p></div>
              {lesson.status === "PUBLISHED" ? <button className="secondary-action" onClick={() => changeStatus(lesson.id, "DRAFT")}>إلغاء النشر</button> : <button className="primary-action" onClick={() => changeStatus(lesson.id, "PUBLISHED")}>نشر الدرس</button>}
            </article>)}
          </section>
          <section className="admin-section">
            <h2>إنشاء درس جديد</h2>
            <form className="admin-form" onSubmit={createLesson}>
              <label>المستوى<select required value={levelId} onChange={e => setLevelId(e.target.value)}>{levels.map(level => <option key={level.id} value={level.id}>{level.code.replace("_", "-")} — {level.title}</option>)}</select></label>
              <label>عنوان الدرس<input required maxLength={160} value={title} onChange={e => setTitle(e.target.value)} /></label>
              <label>المعرّف اللاتيني (slug)<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={e => setSlug(e.target.value)} placeholder="first-greeting" /></label>
              <label>ملخص الدرس<input required maxLength={500} value={summary} onChange={e => setSummary(e.target.value)} /></label>
              <label>هدف التعلم<input required maxLength={500} value={objective} onChange={e => setObjective(e.target.value)} /></label>
              <label>المدة بالدقائق<input required type="number" min={1} max={180} value={durationMin} onChange={e => setDurationMin(Number(e.target.value))} /></label>
              <label>محتوى الدرس بصيغة JSON<textarea required rows={16} value={content} onChange={e => setContent(e.target.value)} /></label>
              <button className="primary-action" type="submit" disabled={saving || levels.length === 0}>{saving ? "جارٍ الحفظ..." : "حفظ كمسودة"}</button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}

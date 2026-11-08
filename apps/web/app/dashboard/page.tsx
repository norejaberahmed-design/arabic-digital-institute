"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Progress = {
  lessonId: string; completed: boolean; lastPosition: number; completedAt: string | null;
  lesson: { slug: string; title: string; level: { code: string } };
};

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/progress")
      .then(async response => {
        if (response.status === 401) throw new Error("سجل الدخول أولاً لعرض تقدمك.");
        if (!response.ok) throw new Error("تعذر تحميل تقدمك حالياً.");
        return response.json() as Promise<{ data: Progress[] }>;
      })
      .then(result => { if (active) setItems(result.data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "حدث خطأ."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (isPending) return <main className="shell"><p>جارٍ تحميل حسابك...</p></main>;
  if (!session?.user) return <main className="shell"><section className="account-panel"><h1>سجّل الدخول لمتابعة تقدمك</h1><Link className="primary-action" href="/account">تسجيل الدخول</Link></section></main>;

  const completed = items.filter(item => item.completed).length;
  return (
    <main className="shell lessons-shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">ع</span><span>المعهد الرقمي</span></Link>
        <button className="text-action" type="button" onClick={async () => { await authClient.signOut(); window.location.href = "/"; }}>تسجيل الخروج</button>
      </header>
      <section className="lessons-heading">
        <p className="section-kicker">LEARNER DASHBOARD</p>
        <h1>مرحباً، {session.user.name}</h1>
        <p className="muted">تابع رحلتك في تعلم العربية. تقدمك محفوظ في حسابك.</p>
      </section>
      <section className="dashboard-stats">
        <div className="stat-card"><strong>{completed}</strong><span>دروس مكتملة</span></div>
        <div className="stat-card"><strong>{items.length}</strong><span>دروس بدأت بها</span></div>
      </section>
      {loading ? <p className="muted">جارٍ تحميل التقدم...</p> : error ? <p className="answer-feedback incorrect">{error}</p> : items.length === 0 ? (
        <div className="system-message"><strong>رحلتك تبدأ من هنا.</strong><p>لم تبدأ أي درس بعد. اختر درساً قصيراً وابدأ الآن.</p><Link className="primary-action" href="/lessons">استعراض الدروس</Link></div>
      ) : (
        <section className="lesson-list">
          {items.map(item => <article className="lesson-list-card" key={item.lessonId}>
            <div className="lesson-info"><span className="level-code">{item.lesson.level.code.replace("_", "-")}</span><h2>{item.lesson.title}</h2><p>{item.completed ? "مكتمل" : "قيد التعلم"}</p></div>
            <Link className="level-link" href={`/lessons/${item.lesson.slug}`}>متابعة ←</Link>
          </article>)}
        </section>
      )}
    </main>
  );
}

"use client";

import Link from "next/link";

const learningCards = [
  { number: "01", title: "اكتشف الحروف", detail: "28 حرفاً وأشكالها داخل الكلمات", action: "افتح استوديو الحروف", href: "/alphabet", tone: "violet", symbol: "ب" },
  { number: "02", title: "كوّن كلماتك الأولى", detail: "اربط الحروف واقرأ كلمات قصيرة", action: "استكشف الدروس", href: "/lessons", tone: "mint", symbol: "باب" },
  { number: "03", title: "افهم عبارات الحياة", detail: "تحية وتعارف ومواقف يومية", action: "ابدأ التعلم", href: "/lessons", tone: "amber", symbol: "مرحبا" },
];

const levels = [
  { code: "PRE-A1", title: "البداية من الصفر", detail: "الحروف، الكلمات الأولى، والتحية", status: "متاح للبدء", active: true },
  { code: "A1", title: "العربية في حياتك", detail: "الأسرة، الطعام، الوقت، والأماكن", status: "قيد الإعداد", active: false },
  { code: "A2", title: "تواصل بثقة أكبر", detail: "مواقف يومية وحوارات أطول", status: "ضمن خارطة المنهج", active: false },
];

export default function InstituteExperience() {
  return (
    <main className="home-v2" dir="rtl">
      <header className="home-v2-header">
        <Link className="home-v2-brand" href="/" aria-label="المعهد الرقمي">
          <span className="home-v2-brand-mark">ع</span>
          <span><strong>المعهد الرقمي</strong><small>ARABIC DIGITAL INSTITUTE</small></span>
        </Link>
        <nav className="home-v2-nav" aria-label="التنقل الرئيسي">
          <Link href="/alphabet">الأبجدية</Link>
          <Link href="/lessons">الدروس</Link>
          <Link href="/account">حساب الطالب</Link>
        </nav>
      </header>

      <section className="home-v2-hero">
        <div className="home-v2-copy">
          <span className="home-v2-kicker"><i /> رحلة عربية تبدأ من الصفر</span>
          <h1>تعلّم العربية.<br /><em>حرفاً بعد حرف.</em></h1>
          <p>تجربة تعليمية واضحة وممتعة للناطقين بالإنجليزية. تعرّف على الحروف، افهم الكلمات، ثم استخدم العربية في مواقف الحياة اليومية.</p>
          <div className="home-v2-actions">
            <Link className="home-v2-primary" href="/alphabet">ابدأ بالحروف <span>←</span></Link>
            <Link className="home-v2-secondary" href="/lessons">استكشف الدروس</Link>
          </div>
          <div className="home-v2-trust">
            <span>28 حرفاً في استوديو تفاعلي</span><i />
            <span>مسار يبدأ من Pre-A1</span><i />
            <span>مصمم للجوال</span>
          </div>
        </div>
        <div className="home-v2-art" aria-label="نماذج ملونة من الحروف العربية">
          <div className="home-v2-art-orbit" />
          <div className="home-v2-letter-card home-v2-tone-violet"><span>ع</span><small>عين</small></div>
          <div className="home-v2-mini-card mini-b home-v2-tone-coral">ب</div>
          <div className="home-v2-mini-card mini-m home-v2-tone-mint">م</div>
          <div className="home-v2-mini-card mini-s home-v2-tone-sky">س</div>
          <div className="home-v2-art-caption"><strong>العربية تبدأ هنا</strong><span>استكشف · تعلّم · استخدم</span></div>
        </div>
      </section>

      <section className="home-v2-section">
        <div className="home-v2-section-heading">
          <div><span className="home-v2-kicker">طريقتك في التعلم</span><h2>خطوات صغيرة، مهارات حقيقية.</h2></div>
          <p>كل مرحلة تقودك إلى استخدام ما تعلمته، لا إلى حفظه فقط.</p>
        </div>
        <div className="home-v2-learning-grid">
          {learningCards.map((card) => (
            <Link href={card.href} key={card.number} className={`home-v2-learning-card home-v2-tone-${card.tone}`}>
              <div className="home-v2-card-top"><span>{card.number}</span><b>{card.symbol}</b></div>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
              <strong>{card.action} <span>←</span></strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-v2-path">
        <div className="home-v2-section-heading">
          <div><span className="home-v2-kicker">مسار المعهد</span><h2>تعلّم وفق مستواك.</h2></div>
          <p>من أول حرف إلى المحادثة، بمسار متدرج وأهداف واضحة.</p>
        </div>
        <div className="home-v2-level-list">
          {levels.map((level, index) => (
            <div className={`home-v2-level${level.active ? " is-active" : ""}`} key={level.code}>
              <span className="home-v2-level-number">0{index + 1}</span>
              <div className="home-v2-level-code">{level.code}</div>
              <div className="home-v2-level-copy"><h3>{level.title}</h3><p>{level.detail}</p></div>
              <span className={level.active ? "home-v2-status active" : "home-v2-status"}>{level.status}</span>
              {level.active && <Link href="/lessons" aria-label="ابدأ المستوى التمهيدي">ابدأ ←</Link>}
            </div>
          ))}
        </div>
      </section>

      <section className="home-v2-note">
        <span className="home-v2-note-icon">✦</span>
        <div><strong>نتعلم العربية كما تُستخدم.</strong><p>نبدأ بعربية معاصرة واضحة، ونشرح الفروق بين الفصحى والتعبيرات الإقليمية عندما يحتاج إليها المتعلم.</p></div>
      </section>

      <footer className="home-v2-footer">
        <Link className="home-v2-brand" href="/"><span className="home-v2-brand-mark">ع</span><span><strong>المعهد الرقمي</strong><small>ARABIC DIGITAL INSTITUTE</small></span></Link>
        <span>تعلّم لغة، وافتح عالماً.</span>
        <nav><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav>
      </footer>
    </main>
  );
}

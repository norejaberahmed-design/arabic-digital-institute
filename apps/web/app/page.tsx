const learningPath = [
  { code: "Pre-A1", title: "البداية مع العربية", detail: "الحروف والتحية والتعارف", progress: "ابدأ الآن" },
  { code: "A1", title: "الحياة اليومية", detail: "الأسرة والطعام والوقت والأماكن", progress: "قريباً" },
  { code: "A2", title: "التواصل المستقل", detail: "العمل والسفر والخطط", progress: "قريباً" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="المعهد الرقمي">
          <span className="brand-mark">ع</span>
          <span>المعهد الرقمي</span>
        </a>
        <span className="language">العربية <span aria-hidden="true">⌄</span></span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ARABIC DIGITAL INSTITUTE</p>
          <h1>العربية، خطوة<br />بخطوة.</h1>
          <p className="intro">تعلم العربية التي تستخدمها في الحياة الحقيقية. استمع، تحدث، اقرأ، واكتب — كل يوم.</p>
          <a className="primary-action" href="#levels">ابدأ رحلة التعلم <span aria-hidden="true">←</span></a>
          <p className="hero-note">دروس قصيرة · تعلم من هاتفك · تقدم على مستواك</p>
        </div>
        <div className="hero-art" aria-label="بطاقة تعليمية باللغة العربية">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="word-card">
            <span className="word-label">كلمتك الأولى</span>
            <strong>مرحبا</strong>
            <span className="transliteration">marhaban</span>
            <span className="translation">Hello</span>
          </div>
          <span className="floating-dot dot-one">ا</span>
          <span className="floating-dot dot-two">ب</span>
        </div>
      </section>

      <section className="welcome-row">
        <div>
          <p className="section-kicker">مسارك التعليمي</p>
          <h2 id="levels">اختر نقطة البداية</h2>
          <p className="muted">ابدأ من مستواك، وسنبني مهاراتك بالتدريج.</p>
        </div>
        <span className="level-count">7 مستويات من Pre-A1 إلى C2</span>
      </section>

      <section className="level-grid" aria-label="المستويات التعليمية">
        {learningPath.map((level, index) => (
          <article className={index === 0 ? "level-card featured" : "level-card"} key={level.code}>
            <div className="level-card-top"><span className="level-code">{level.code}</span><span className="level-number">0{index + 1}</span></div>
            <h3>{level.title}</h3>
            <p>{level.detail}</p>
            <a href={index === 0 ? "/lessons" : "#levels"} className="level-link">{level.progress} <span aria-hidden="true">←</span></a>
          </article>
        ))}
      </section>

      <footer className="footer">
        <span>المعهد الرقمي لتعليم العربية</span>
        <span>تعلم لغة، وافتح عالماً.</span>
      </footer>
    </main>
  );
}

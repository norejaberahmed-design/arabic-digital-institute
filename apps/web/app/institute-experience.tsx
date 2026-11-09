"use client";

import Link from "next/link";
import { useState } from "react";

type Scene = "campus" | "classroom" | "letters";

const scenes: { id: Scene; label: string; hint: string }[] = [
  { id: "campus", label: "المعهد", hint: "استكشف أقسام المعهد" },
  { id: "classroom", label: "الفصل", hint: "ادخل فصلك الافتراضي" },
  { id: "letters", label: "الحروف", hint: "اكتشف الحروف العربية" },
];

const letters = [
  { char: "أ", sound: "alif", word: "أسد", meaning: "lion" },
  { char: "ب", sound: "baa", word: "باب", meaning: "door" },
  { char: "ت", sound: "taa", word: "تمر", meaning: "dates" },
  { char: "ث", sound: "thaa", word: "ثوب", meaning: "dress" },
];

export default function InstituteExperience() {
  const [scene, setScene] = useState<Scene>("campus");
  const [letterIndex, setLetterIndex] = useState(0);
  const currentLetter = letters[letterIndex];

  return (
    <main className="world-shell">
      <header className="world-header">
        <Link className="world-brand" href="/" aria-label="المعهد الرقمي">
          <span className="world-brand-mark">ع</span>
          <span><strong>المعهد الرقمي</strong><small>ARABIC DIGITAL INSTITUTE</small></span>
        </Link>
        <nav className="world-nav" aria-label="التنقل الرئيسي">
          <Link href="/lessons">الدروس</Link>
          <Link href="/account">حساب الطالب</Link>
        </nav>
      </header>

      <section className="world-intro">
        <div className="world-copy">
          <span className="world-eyebrow">تعلم العربية بطريقة مختلفة</span>
          <h1>ادخل عالماً<br /><em>يتحدث العربية.</em></h1>
          <p>تجوّل في معهدك الافتراضي، اكتشف الحروف، وتعلّم من خلال مواقف تفاعلية صُممت لتعمل على هاتفك.</p>
          <div className="world-actions">
            <Link className="world-primary" href="/lessons">ابدأ أول درس <span aria-hidden="true">←</span></Link>
            <Link className="world-secondary" href="/account">دخول الطالب</Link>
          </div>
          <div className="world-facts"><span>٧ مستويات تعليمية</span><i /> <span>تعلم من الجوال</span><i /> <span>عربي + English</span></div>
        </div>

        <div className="world-stage-wrap">
          <div className="world-stage-top"><span className="live-dot" /> <span>مساحتك التعليمية</span><span className="stage-coordinate">ADI · 3D WORLD</span></div>
          <div className={"world-stage scene-" + scene} aria-label="مشهد ثلاثي الأبعاد تفاعلي للمعهد">
            <div className="world-sky-orb orb-a" /><div className="world-sky-orb orb-b" />
            {scene === "campus" && (
              <div className="campus-model" aria-hidden="true">
                <div className="campus-shadow" />
                <div className="campus-building">
                  <div className="building-roof"><span>المعهد</span></div>
                  <div className="building-front">
                    <div className="building-sign">ARABIC DIGITAL INSTITUTE</div>
                    <div className="building-window window-one" /><div className="building-window window-two" />
                    <div className="building-door"><span>ع</span></div>
                    <div className="building-steps" />
                  </div>
                  <div className="building-side"><span>تعلم · اكتشف · تحدث</span></div>
                </div>
                <div className="campus-tree tree-one"><i /><b /></div><div className="campus-tree tree-two"><i /><b /></div>
                <div className="campus-path" />
                <div className="campus-plaque">مرحباً بك</div>
              </div>
            )}
            {scene === "classroom" && (
              <div className="classroom-model" aria-hidden="true">
                <div className="room-back-wall"><div className="room-board"><small>درس اليوم</small><strong>مرحبا</strong><span>marhaban · hello</span></div><div className="room-window" /></div>
                <div className="room-floor" />
                <div className="room-desk desk-one"><i /><b /></div><div className="room-desk desk-two"><i /><b /></div>
                <div className="room-teacher"><div className="teacher-head">ع</div><div className="teacher-body" /></div>
                <div className="room-caption">الفصل الافتراضي · المستوى التمهيدي</div>
              </div>
            )}
            {scene === "letters" && (
              <div className="letter-world" aria-live="polite">
                <div className="letter-platform"><div className="letter-object">{currentLetter.char}</div></div>
                <div className="letter-label"><strong>{currentLetter.word}</strong><span>{currentLetter.sound} · {currentLetter.meaning}</span></div>
                <div className="letter-orbit orbit-left" /><div className="letter-orbit orbit-right" />
              </div>
            )}
          </div>
          <div className="scene-switcher" role="group" aria-label="اختر المشهد">
            {scenes.map((item) => (
              <button key={item.id} type="button" className={scene === item.id ? "scene-tab active" : "scene-tab"} onClick={() => setScene(item.id)} aria-pressed={scene === item.id}>
                <span className="scene-tab-icon">{item.id === "campus" ? "⌂" : item.id === "classroom" ? "▤" : "ع"}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {scene === "letters" && <div className="letter-controls"><button type="button" onClick={() => setLetterIndex((letterIndex + letters.length - 1) % letters.length)} aria-label="الحرف السابق">‹</button><button type="button" onClick={() => setLetterIndex((letterIndex + 1) % letters.length)} aria-label="الحرف التالي">›</button></div>}
          </div>
          <p className="scene-hint">{scenes.find((item) => item.id === scene)?.hint}</p>
        </div>
      </section>

      <section className="world-journey">
        <div className="journey-heading"><span>رحلتك داخل المعهد</span><h2>كل مهارة لها مساحة.</h2><p>ابدأ من الحروف، ثم انتقل إلى الكلمات والمحادثات والحياة اليومية.</p></div>
        <div className="journey-grid">
          <Link href="/lessons" className="journey-card card-letters"><span className="journey-number">01</span><div className="journey-3d-letter">ب</div><strong>عالم الحروف</strong><small>تعرّف على أشكال الحروف وأصواتها</small><b>استكشف ←</b></Link>
          <Link href="/lessons" className="journey-card card-class"><span className="journey-number">02</span><div className="journey-3d-book">▤</div><strong>الفصول والدروس</strong><small>تعلم من خلال مواقف واقعية قصيرة</small><b>ادخل الفصل ←</b></Link>
          <Link href="/lessons" className="journey-card card-speak"><span className="journey-number">03</span><div className="journey-3d-sound">◖</div><strong>استمع وتحدث</strong><small>استمع وكرّر الكلمات بصوتك</small><b>تدرّب الآن ←</b></Link>
        </div>
      </section>

      <footer className="world-footer"><span>المعهد الرقمي لتعليم العربية</span><span>نتعلم خطوة، ونكتشف عالماً.</span><nav><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav></footer>
    </main>
  );
}

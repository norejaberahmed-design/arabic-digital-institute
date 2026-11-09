"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Letter = {
  char: string;
  name: string;
  nameEn: string;
  transliteration: string;
  cue: string;
  articulation: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  joinsNext: boolean;
  tone: string;
};

const letters: Letter[] = [
  { char: "ا", name: "ألف", nameEn: "Alif", transliteration: "a", cue: "A long vowel carrier; hamza gives the glottal start in words such as أَ.", articulation: "The letter alif is primarily used to carry a long ā vowel. The glottal stop belongs to hamza, which may be written above or below alif.", isolated: "ا", initial: "ا", medial: "ـا", final: "ـا", joinsNext: false, tone: "coral" },
  { char: "ب", name: "باء", nameEn: "Bāʼ", transliteration: "b", cue: "Like b in book.", articulation: "Close both lips, then release the air with voice.", isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب", joinsNext: true, tone: "blue" },
  { char: "ت", name: "تاء", nameEn: "Tāʼ", transliteration: "t", cue: "Like t in stop, with a clear, unvoiced release.", articulation: "Place the tongue tip near the upper front teeth and release a short burst of air.", isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت", joinsNext: true, tone: "mint" },
  { char: "ث", name: "ثاء", nameEn: "Thāʼ", transliteration: "th", cue: "Like th in think.", articulation: "Let the tongue tip lightly touch or approach the edge of the upper front teeth; let air pass without voice.", isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث", joinsNext: true, tone: "violet" },
  { char: "ج", name: "جيم", nameEn: "Jīm", transliteration: "j", cue: "Like j in jam in the shared teaching model.", articulation: "A voiced sound made by briefly stopping airflow and releasing it near the front of the palate. Regional pronunciations vary.", isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج", joinsNext: true, tone: "amber" },
  { char: "ح", name: "حاء", nameEn: "Ḥāʼ", transliteration: "ḥ", cue: "A deep, breathy h; not the English h.", articulation: "A voiceless pharyngeal sound. Keep the throat open and constrict gently in the pharynx; do not force the voice.", isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح", joinsNext: true, tone: "rose" },
  { char: "خ", name: "خاء", nameEn: "Khāʼ", transliteration: "kh", cue: "Like the sound in Scottish loch.", articulation: "A voiceless fricative made at the back of the mouth, near the soft palate.", isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ", joinsNext: true, tone: "sky" },
  { char: "د", name: "دال", nameEn: "Dāl", transliteration: "d", cue: "Like d in day.", articulation: "Touch the tongue tip to the ridge just behind the upper front teeth, then release with voice.", isolated: "د", initial: "د", medial: "ـد", final: "ـد", joinsNext: false, tone: "mint" },
  { char: "ذ", name: "ذال", nameEn: "Dhāl", transliteration: "dh", cue: "Like th in this.", articulation: "Place the tongue tip lightly between or against the upper front teeth and use your voice.", isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ", joinsNext: false, tone: "violet" },
  { char: "ر", name: "راء", nameEn: "Rāʼ", transliteration: "r", cue: "A light tapped or trilled r; not the English r.", articulation: "Tap or briefly vibrate the tongue tip near the ridge behind the upper front teeth.", isolated: "ر", initial: "ر", medial: "ـر", final: "ـر", joinsNext: false, tone: "amber" },
  { char: "ز", name: "زاي", nameEn: "Zāy", transliteration: "z", cue: "Like z in zoo.", articulation: "Use the same tongue position as s, but turn the voice on.", isolated: "ز", initial: "ز", medial: "ـز", final: "ـز", joinsNext: false, tone: "blue" },
  { char: "س", name: "سين", nameEn: "Sīn", transliteration: "s", cue: "Like s in sun.", articulation: "Bring the tongue close to the ridge behind the upper teeth and let air pass continuously.", isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس", joinsNext: true, tone: "sky" },
  { char: "ش", name: "شين", nameEn: "Shīn", transliteration: "sh", cue: "Like sh in ship.", articulation: "Raise the front of the tongue toward the hard palate and let air pass with friction.", isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش", joinsNext: true, tone: "rose" },
  { char: "ص", name: "صاد", nameEn: "Ṣād", transliteration: "ṣ", cue: "An emphatic s; a darker, backed version of س.", articulation: "Keep the s sound while raising the back of the tongue toward the soft palate. Avoid adding a separate vowel.", isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص", joinsNext: true, tone: "coral" },
  { char: "ض", name: "ضاد", nameEn: "Ḍād", transliteration: "ḍ", cue: "An emphatic d; a darker, backed version of د.", articulation: "Use a voiced stop with the tongue backed toward the soft palate. The exact place of articulation varies across Arabic traditions.", isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض", joinsNext: true, tone: "amber" },
  { char: "ط", name: "طاء", nameEn: "Ṭāʼ", transliteration: "ṭ", cue: "An emphatic t; a darker, backed version of ت.", articulation: "Make a voiceless t while raising the back of the tongue toward the soft palate.", isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط", joinsNext: true, tone: "mint" },
  { char: "ظ", name: "ظاء", nameEn: "Ẓāʼ", transliteration: "ẓ", cue: "An emphatic voiced th, as a backed version of ذ in the shared model.", articulation: "Use a voiced interdental sound with the tongue near the upper teeth and a backed tongue posture. Regional realizations vary.", isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ", joinsNext: true, tone: "violet" },
  { char: "ع", name: "عين", nameEn: "ʿAyn", transliteration: "ʿ", cue: "A voiced throat sound with no exact English equivalent.", articulation: "A voiced pharyngeal sound. Narrow the throat gently while keeping the sound voiced; learn it with a qualified audio model.", isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع", joinsNext: true, tone: "rose" },
  { char: "غ", name: "غين", nameEn: "Ghayn", transliteration: "gh", cue: "A voiced version of خ, similar to a French r in some accents.", articulation: "Create friction at the back of the mouth and use your voice.", isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ", joinsNext: true, tone: "sky" },
  { char: "ف", name: "فاء", nameEn: "Fāʼ", transliteration: "f", cue: "Like f in fine.", articulation: "Touch the upper front teeth lightly to the lower lip and let air pass.", isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف", joinsNext: true, tone: "blue" },
  { char: "ق", name: "قاف", nameEn: "Qāf", transliteration: "q", cue: "A deep k-like sound made farther back than ك.", articulation: "Close the back of the tongue against the uvula area and release. Spoken regional forms vary.", isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق", joinsNext: true, tone: "coral" },
  { char: "ك", name: "كاف", nameEn: "Kāf", transliteration: "k", cue: "Like k in sky.", articulation: "Raise the back of the tongue to the soft palate and release a short unvoiced burst.", isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك", joinsNext: true, tone: "mint" },
  { char: "ل", name: "لام", nameEn: "Lām", transliteration: "l", cue: "Like l in light.", articulation: "Touch the tongue tip or blade to the ridge behind the upper front teeth and let air flow around the sides.", isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل", joinsNext: true, tone: "violet" },
  { char: "م", name: "ميم", nameEn: "Mīm", transliteration: "m", cue: "Like m in moon.", articulation: "Close both lips and let the voice resonate through the nose.", isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم", joinsNext: true, tone: "rose" },
  { char: "ن", name: "نون", nameEn: "Nūn", transliteration: "n", cue: "Like n in name.", articulation: "Touch the tongue tip near the upper teeth ridge and let the voice resonate through the nose.", isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن", joinsNext: true, tone: "amber" },
  { char: "ه", name: "هاء", nameEn: "Hāʼ", transliteration: "h", cue: "Like h in hat.", articulation: "Let air pass gently through an open throat without the stronger constriction of ح.", isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه", joinsNext: true, tone: "sky" },
  { char: "و", name: "واو", nameEn: "Wāw", transliteration: "w", cue: "Like w in water; it can also carry a long ū vowel.", articulation: "Round the lips for the consonant w. In long-vowel use, sustain the rounded ū sound.", isolated: "و", initial: "و", medial: "ـو", final: "ـو", joinsNext: false, tone: "blue" },
  { char: "ي", name: "ياء", nameEn: "Yāʼ", transliteration: "y", cue: "Like y in yes; it can also carry a long ī vowel.", articulation: "Raise the front of the tongue toward the hard palate for y. In long-vowel use, sustain ī.", isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي", joinsNext: true, tone: "mint" },
];

const positionLabels = [
  { key: "isolated", label: "منفصل", hint: "الحرف وحده" },
  { key: "initial", label: "أول الكلمة", hint: "في بداية الكلمة" },
  { key: "medial", label: "وسط الكلمة", hint: "متصل من الجانبين إن أمكن" },
  { key: "final", label: "آخر الكلمة", hint: "في نهاية الكلمة" },
] as const;

export default function AlphabetExplorer() {
  const [selectedChar, setSelectedChar] = useState("ا");
  const [query, setQuery] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizChoice, setQuizChoice] = useState("");
  const [quizChecked, setQuizChecked] = useState(false);

  const current = letters.find((letter) => letter.char === selectedChar) ?? letters[0];
  const filteredLetters = useMemo(() => {
    const value = query.trim().toLocaleLowerCase();
    if (!value) return letters;
    return letters.filter((letter) =>
      letter.char.includes(value) ||
      letter.name.includes(value) ||
      letter.nameEn.toLocaleLowerCase().includes(value) ||
      letter.transliteration.toLocaleLowerCase().includes(value)
    );
  }, [query]);

  const quizOptions = [
    { value: current.isolated, label: "منفصل" },
    { value: current.initial, label: "أول الكلمة" },
    { value: current.medial, label: current.joinsNext ? "وسط الكلمة" : "وسط / آخر الكلمة" },
    { value: current.final, label: "آخر الكلمة" },
  ].filter((option, index, all) => all.findIndex((candidate) => candidate.value === option.value) === index);

  function selectLetter(char: string) {
    setSelectedChar(char);
    setShowQuiz(false);
    setQuizChoice("");
    setQuizChecked(false);
  }

  return (
    <main className="alphabet-page">
      <header className="alphabet-header">
        <Link className="alphabet-brand" href="/" aria-label="العودة إلى المعهد">
          <span className="alphabet-brand-mark">ع</span>
          <span><strong>المعهد الرقمي</strong><small>ARABIC DIGITAL INSTITUTE</small></span>
        </Link>
        <nav className="alphabet-nav" aria-label="التنقل">
          <Link href="/lessons">الدروس</Link>
          <Link href="/account">حساب الطالب</Link>
        </nav>
      </header>

      <section className="alphabet-hero">
        <div className="alphabet-hero-copy">
          <span className="alphabet-eyebrow">PRE-A1 · أساسيات القراءة والكتابة</span>
          <h1>28 حرفاً.<br /><span>عالم كامل من الأصوات.</span></h1>
          <p>اكتشف الحروف العربية خطوة بخطوة. تعرّف على أشكالها عندما تتصل بالكلمات، وتدرّب على تمييزها وكتابتها.</p>
          <div className="alphabet-hero-stats">
            <span><strong>28</strong> حرفاً</span>
            <span><strong>4</strong> أشكال للمقارنة</span>
            <span><strong>RTL</strong> من اليمين لليسار</span>
          </div>
        </div>
        <div className="alphabet-hero-art" aria-hidden="true">
          <span className="alphabet-orbit orbit-a" />
          <span className="alphabet-orbit orbit-b" />
          <div className="alphabet-hero-letter tone-violet">ع</div>
          <span className="alphabet-float float-one tone-coral">ب</span>
          <span className="alphabet-float float-two tone-mint">م</span>
          <span className="alphabet-float float-three tone-sky">س</span>
        </div>
      </section>

      <section className="alphabet-workspace">
        <div className="alphabet-list-panel">
          <div className="alphabet-list-heading">
            <div><span className="alphabet-eyebrow">اكتشف الأبجدية</span><h2>الحروف العربية</h2></div>
            <span className="alphabet-count">{filteredLetters.length} / 28</span>
          </div>
          <label className="alphabet-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن حرف أو اسمه..." aria-label="ابحث عن حرف" />
          </label>
          <div className="alphabet-grid" dir="rtl">
            {filteredLetters.map((letter, index) => (
              <button
                key={letter.char}
                type="button"
                className={`alphabet-tile tone-${letter.tone}${selectedChar === letter.char ? " is-selected" : ""}`}
                onClick={() => selectLetter(letter.char)}
                aria-pressed={selectedChar === letter.char}
                aria-label={`اختر حرف ${letter.name}`}
              >
                <span className="alphabet-tile-char">{letter.char}</span>
                <span className="alphabet-tile-name">{letter.name}</span>
                <span className="alphabet-tile-index">{String(letters.indexOf(letter) + 1).padStart(2, "0")}</span>
              </button>
            ))}
            {filteredLetters.length === 0 && <p className="alphabet-empty">لم نعثر على حرف بهذا الاسم.</p>}
          </div>
          <p className="alphabet-color-note"><span /> الألوان تساعدك على تمييز البطاقات، ولا تمثل تصنيفاً صوتياً.</p>
        </div>

        <aside className="letter-detail-panel" aria-live="polite">
          <div className="letter-detail-top">
            <span className="alphabet-eyebrow">الحرف المختار</span>
            <span className="letter-detail-code">PRE-A1 · {String(letters.indexOf(current) + 1).padStart(2, "0")}</span>
          </div>
          <div className={`letter-showcase tone-${current.tone}`}>
            <span className="letter-showcase-char">{current.char}</span>
            <span className="letter-showcase-name">{current.name} · {current.nameEn}</span>
            <span className="letter-showcase-latin">{current.transliteration}</span>
          </div>
          <section className="letter-forms">
            <div className="letter-section-title"><h3>أشكال الحرف</h3><span>اقرأ من اليمين إلى اليسار</span></div>
            <div className="letter-form-grid" dir="rtl">
              {positionLabels.map((position) => (
                <div className="letter-form-card" key={position.key}>
                  <span className="letter-form-char">{current[position.key]}</span>
                  <strong>{position.label}</strong>
                  <small>{position.hint}</small>
                </div>
              ))}
            </div>
            {!current.joinsNext && <p className="letter-connection-note">هذا الحرف لا يتصل بالحرف الذي يأتي بعده. لذلك يتغير شكل الاتصال قبله فقط.</p>}
          </section>
          <section className="letter-sound-guide">
            <div className="letter-section-title"><h3>دليل الصوت ومخرج الحرف</h3><span>معلومة تعليمية أولية</span></div>
            <p className="letter-sound-cue">{current.cue}</p>
            <p className="letter-articulation">{current.articulation}</p>
            <div className="audio-integrity-note">
              <span className="audio-integrity-icon">♫</span>
              <span><strong>الصوت المرجعي المعتمد</strong><small>لن نشغّل نطقاً آلياً غير موثوق. ستضاف تسجيلات متحدثين عرب بعد مراجعة النطق وجودة الصوت.</small></span>
            </div>
          </section>
          <section className="letter-practice">
            <div className="letter-section-title"><h3>اختبر تمييزك</h3><span>تدريب سريع</span></div>
            {!showQuiz ? (
              <button className="letter-practice-start" type="button" onClick={() => setShowQuiz(true)}>ابدأ التدريب <span>←</span></button>
            ) : (
              <div className="letter-quiz">
                <p>اختر الشكل الذي يظهر لحرف <strong>{current.char}</strong> في وسط الكلمة.</p>
                <div className="letter-quiz-options" dir="rtl">
                  {quizOptions.map((option) => (
                    <button key={option.label} type="button" className={quizChoice === option.label ? "chosen" : ""} onClick={() => { setQuizChoice(option.label); setQuizChecked(false); }}>
                      <span>{option.value}</span><small>{option.label}</small>
                    </button>
                  ))}
                </div>
                <button className="letter-quiz-check" type="button" disabled={!quizChoice} onClick={() => setQuizChecked(true)}>تحقق من الإجابة</button>
                {quizChecked && <p className={quizChoice === current.medial ? "letter-quiz-feedback good" : "letter-quiz-feedback retry"}>{quizChoice === current.medial ? (current.joinsNext ? "أحسنت! هذا هو شكل الحرف في وسط الكلمة." : "أحسنت! هذا الحرف لا يتصل بما بعده، لذلك يتشابه شكله في الوسط والنهاية.") : "حاول مرة أخرى. ابحث عن الشكل الذي يسبق الحرف ويتصل به من اليمين."}</p>}
              </div>
            )}
          </section>
        </aside>
      </section>

      <footer className="alphabet-footer">
        <Link href="/">العودة إلى المعهد</Link>
        <span>التعلم المتقن يبدأ بخطوة واضحة.</span>
        <Link href="/lessons">انتقل إلى الدروس ←</Link>
      </footer>
    </main>
  );
}

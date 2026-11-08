"use client";

import { useState } from "react";

type Section = {
  id: string;
  type: string;
  title: string;
  lines?: Array<{ speaker: string; arabic: string; transliteration: string; english: string }>;
  items?: Array<{ arabic: string; transliteration: string; english: string }>;
  prompt?: string;
  options?: Array<{ id: string; label: string }>;
  answer?: string;
  explanation?: string;
};

export default function LessonPlayer({ sections }: { sections: Section[] }) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const question = sections.find((section) => section.type === "multiple-choice");
  const correct = Boolean(question && selected && selected === question.answer);

  return (
    <div className="lesson-content">
      {sections.map((section) => (
        <section className="lesson-section" key={section.id}>
          <p className="section-kicker">{section.type === "dialogue" ? "LISTEN & REPEAT" : section.type === "vocabulary" ? "NEW WORDS" : "PRACTICE"}</p>
          <h2>{section.title}</h2>
          {section.lines?.map((line, index) => (
            <div className="dialogue-line" key={index}>
              <span className="speaker">{line.speaker}</span>
              <div><strong lang="ar" dir="rtl">{line.arabic}</strong><span>{line.transliteration}</span><small>{line.english}</small></div>
            </div>
          ))}
          {section.items?.map((item) => (
            <div className="vocab-row" key={item.arabic}>
              <strong lang="ar" dir="rtl">{item.arabic}</strong>
              <span>{item.transliteration}</span>
              <small>{item.english}</small>
            </div>
          ))}
          {section.prompt && (
            <div className="question-box">
              <h3>{section.prompt}</h3>
              <div className="answer-options">
                {section.options?.map((option) => (
                  <button type="button" key={option.id} className={selected === option.id ? "answer-option selected" : "answer-option"} onClick={() => { setSelected(option.id); setChecked(false); }}>
                    {option.label}
                  </button>
                ))}
              </div>
              <button type="button" className="primary-action check-answer" disabled={!selected} onClick={() => setChecked(true)}>تحقق من الإجابة</button>
              {checked && <p className={correct ? "answer-feedback correct" : "answer-feedback incorrect"}>{correct ? "إجابة صحيحة! أحسنت." : "ليست الإجابة الصحيحة بعد. حاول مرة أخرى."} {question?.explanation}</p>}
            </div>
          )}
        </section>
      ))}
      <p className="lesson-disclaimer">هذه نسخة أولية للتجربة. حفظ التقدم والإجابات في حساب الطالب سيُفعّل بعد إكمال تسجيل الدخول وربط قاعدة البيانات.</p>
      <a className="level-link back-link" href="/lessons">← العودة إلى قائمة الدروس</a>
    </div>
  );
}

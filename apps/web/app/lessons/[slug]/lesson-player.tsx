"use client";

import { useState } from "react";
import Link from "next/link";

type Section = {
  id: string;
  type: string;
  title: string;
  lines?: Array<{ speaker: string; arabic: string; transliteration: string; english: string }>;
  items?: Array<{ arabic: string; transliteration: string; english: string }>;
  prompt?: string;
  options?: Array<{ id: string; label: string }>;
  explanation?: string;
};

export default function LessonPlayer({ sections, lessonSlug }: { sections: Section[]; lessonSlug: string }) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const question = sections.find((section) => section.type === "multiple-choice");

  async function checkAnswer() {
    if (!question || !selected || busy) return;
    setBusy(true);
    setFeedback("");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "attempt", lessonSlug, activityId: question.id, answer: selected }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setChecked(false);
        setFeedback("أنشئ حساباً أو سجل الدخول حتى نتحقق من إجابتك ونحفظ محاولتك.");
        return;
      }
      if (!response.ok) throw new Error("تعذر حفظ المحاولة.");
      setCorrect(Boolean(result.data.isCorrect));
      setFeedback(result.data.isCorrect ? "إجابة صحيحة! أحسنت." : "ليست الإجابة الصحيحة بعد. حاول مرة أخرى.");
      setChecked(true);
    } catch {
      setFeedback("تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.");
    } finally {
      setBusy(false);
    }
  }

  async function completeLesson() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", lessonSlug }),
      });
      if (response.status === 401) {
        setFeedback("سجل الدخول أولاً حتى نحفظ إكمال الدرس في حسابك.");
        return;
      }
      if (!response.ok) throw new Error("تعذر حفظ التقدم.");
      setCompleted(true);
    } catch {
      setFeedback("لم نتمكن من حفظ إكمال الدرس. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

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
                  <button type="button" key={option.id} className={selected === option.id ? "answer-option selected" : "answer-option"} onClick={() => { setSelected(option.id); setChecked(false); setFeedback(""); }}>
                    {option.label}
                  </button>
                ))}
              </div>
              <button type="button" className="primary-action check-answer" disabled={!selected || busy} onClick={checkAnswer}>{busy ? "جارٍ التحقق..." : "تحقق واحفظ الإجابة"}</button>
              {checked && <p className={correct ? "answer-feedback correct" : "answer-feedback incorrect"}>{feedback} {question?.explanation}</p>}
              {!checked && feedback && <p className="answer-feedback incorrect" role="alert">{feedback} <Link href="/account">الذهاب إلى الحساب</Link></p>}
            </div>
          )}
        </section>
      ))}
      <div className="completion-panel">
        {completed ? <p className="answer-feedback correct">تم حفظ إكمال الدرس في حسابك. أحسنت!</p> : <button type="button" className="primary-action" disabled={busy} onClick={completeLesson}>إنهاء الدرس وحفظ التقدم</button>}
        <p className="lesson-disclaimer">تُحفظ المحاولات والتقدم في حسابك بعد تسجيل الدخول. لا نرسل إجاباتك إلى خدمات ذكاء اصطناعي خارجية.</p>
      </div>
      <Link className="level-link back-link" href="/lessons">← العودة إلى قائمة الدروس</Link>
    </div>
  );
}

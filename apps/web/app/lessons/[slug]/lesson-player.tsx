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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [busyActivity, setBusyActivity] = useState("");
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState(false);

  async function checkAnswer(activityId: string) {
    const answer = answers[activityId];
    if (!answer || busyActivity) return;
    setBusyActivity(activityId);
    setNotice("");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "attempt", lessonSlug, activityId, answer }),
      });
      const result = await response.json();
      if (response.status === 401) {
        setNotice("أنشئ حساباً أو سجل الدخول حتى نتحقق من إجابتك ونحفظ محاولتك.");
        return;
      }
      if (!response.ok) throw new Error("تعذر حفظ المحاولة.");
      setCorrect(current => ({ ...current, [activityId]: Boolean(result.data.isCorrect) }));
      setFeedback(current => ({ ...current, [activityId]: result.data.isCorrect ? "إجابة صحيحة! أحسنت." : "ليست الإجابة الصحيحة بعد. حاول مرة أخرى." }));
      setChecked(current => ({ ...current, [activityId]: true }));
    } catch {
      setNotice("تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.");
    } finally {
      setBusyActivity("");
    }
  }

  async function completeLesson() {
    if (busyActivity) return;
    setBusyActivity("complete");
    setNotice("");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", lessonSlug }),
      });
      if (response.status === 401) {
        setNotice("سجل الدخول أولاً حتى نحفظ إكمال الدرس في حسابك.");
        return;
      }
      if (!response.ok) throw new Error("تعذر حفظ التقدم.");
      setCompleted(true);
    } catch {
      setNotice("لم نتمكن من حفظ إكمال الدرس. حاول مرة أخرى.");
    } finally {
      setBusyActivity("");
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
                  <button type="button" key={option.id} className={answers[section.id] === option.id ? "answer-option selected" : "answer-option"} onClick={() => {
                    setAnswers(current => ({ ...current, [section.id]: option.id }));
                    setChecked(current => ({ ...current, [section.id]: false }));
                    setFeedback(current => ({ ...current, [section.id]: "" }));
                  }}>
                    {option.label}
                  </button>
                ))}
              </div>
              <button type="button" className="primary-action check-answer" disabled={!answers[section.id] || busyActivity !== ""} onClick={() => checkAnswer(section.id)}>{busyActivity === section.id ? "جارٍ التحقق..." : "تحقق واحفظ الإجابة"}</button>
              {checked[section.id] && <p className={correct[section.id] ? "answer-feedback correct" : "answer-feedback incorrect"}>{feedback[section.id]} {section.explanation}</p>}
            </div>
          )}
        </section>
      ))}
      <div className="completion-panel">
        {completed ? <p className="answer-feedback correct">تم حفظ إكمال الدرس في حسابك. أحسنت!</p> : <button type="button" className="primary-action" disabled={busyActivity !== ""} onClick={completeLesson}>{busyActivity === "complete" ? "جارٍ الحفظ..." : "إنهاء الدرس وحفظ التقدم"}</button>}
        {notice && <p className="answer-feedback incorrect" role="alert">{notice} <Link href="/account">الذهاب إلى الحساب</Link></p>}
        <p className="lesson-disclaimer">تُحفظ المحاولات والتقدم في حسابك بعد تسجيل الدخول. لا نرسل إجاباتك إلى خدمات ذكاء اصطناعي خارجية.</p>
      </div>
      <Link className="level-link back-link" href="/lessons">← العودة إلى قائمة الدروس</Link>
    </div>
  );
}

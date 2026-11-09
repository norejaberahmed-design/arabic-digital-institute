"use client";

import { useState } from "react";
import Link from "next/link";
import SpeechPractice from "./speech-practice";

type Section = {
  id: string;
  type: string;
  title: string;
  lines?: Array<{ speaker: string; arabic: string; transliteration: string; english: string }>;
  items?: Array<{ arabic: string; transliteration: string; english: string }>;
  prompt?: string;
  options?: Array<{ id: string; label: string }>;
  inputTools?: string[];
  letters?: Array<{ char: string; name: string; sound: string; example: string; meaning: string; forms: string[]; note: string }>;
  explanation?: string;
};

function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

export default function LessonPlayer({ sections, lessonSlug }: { sections: Section[]; lessonSlug: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [busyActivity, setBusyActivity] = useState("");
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState(false);
  const [activeLetter, setActiveLetter] = useState(0);

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
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setNotice("سجل الدخول أولاً حتى نحفظ إكمال الدرس في حسابك.");
        return;
      }
      if (response.status === 409 && result.error === "LESSON_REQUIREMENTS_INCOMPLETE") {
        setNotice(`أكمل التمارين المطلوبة بإجابة صحيحة قبل إنهاء الدرس. المتبقي: ${result.remainingActivities ?? "بعض"}.`);
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
          {section.type === "letter-studio" && section.letters?.length ? (
            <div className="letter-studio-3d">
              <div className="letter-model-stage" aria-live="polite">
                <div className="letter-model-orbit" />
                <div className="letter-model-platform" />
                <span className="letter-model-glyph" lang="ar" dir="rtl">{section.letters[activeLetter]?.char}</span>
                <span className="letter-model-caption">{section.letters[activeLetter]?.name}</span>
              </div>
              <div className="letter-model-picker" aria-label="Choose an Arabic letter">
                {section.letters.map((letter, index) => (
                  <button type="button" key={letter.char} aria-pressed={activeLetter === index} className={activeLetter === index ? "active" : ""} onClick={() => setActiveLetter(index)}>{letter.char}</button>
                ))}
              </div>
              <div className="letter-model-details">
                <strong>{section.letters[activeLetter]?.sound}</strong>
                <span>{section.letters[activeLetter]?.note}</span>
                <small>Example: {section.letters[activeLetter]?.example} — {section.letters[activeLetter]?.meaning}</small>
              </div>
              <div className="letter-form-strip">
                {section.letters[activeLetter]?.forms.map((form, index) => (
                  <div key={index}><strong lang="ar" dir="rtl">{form}</strong><small>{["Isolated", "Beginning", "Middle", "End"][index]}</small></div>
                ))}
              </div>
              <p className="letter-studio-note">Touch a letter to inspect it. The model uses lightweight CSS 3D for mobile compatibility.</p>
            </div>
          ) : null}
          {section.lines?.map((line, index) => (
            <div className="dialogue-line" key={index}>
              <span className="speaker">{line.speaker}</span>
              <div><strong lang="ar" dir="rtl">{line.arabic}</strong><button className="speak-button" type="button" aria-label="Listen to Arabic" onClick={() => speakArabic(line.arabic)}>🔊</button><span>{line.transliteration}</span><small>{line.english}</small><SpeechPractice target={line.arabic} /></div>
            </div>
          ))}
          {section.items?.map((item) => (
            <div className="vocab-row" key={item.arabic}>
              <strong lang="ar" dir="rtl">{item.arabic}</strong>
              <button className="speak-button" type="button" aria-label="Listen to Arabic" onClick={() => speakArabic(item.arabic)}>🔊</button>
              <span>{item.transliteration}</span>
              <small>{item.english}</small><SpeechPractice target={item.arabic} />
            </div>
          ))}
          {section.prompt && (
            <div className="question-box">
              <h3>{section.prompt}</h3>
              {section.type === "text-input" ? (
                <div className="text-answer-builder">
                  <input
                    className="arabic-answer-input"
                    type="text"
                    inputMode="text"
                    lang="ar"
                    dir="rtl"
                    autoComplete="off"
                    aria-label="اكتب إجابتك بالعربية"
                    placeholder="اكتب الإجابة هنا"
                    value={answers[section.id] ?? ""}
                    onChange={(event) => {
                      setAnswers(current => ({ ...current, [section.id]: event.target.value }));
                      setChecked(current => ({ ...current, [section.id]: false }));
                      setFeedback(current => ({ ...current, [section.id]: "" }));
                    }}
                  />
                  {section.inputTools?.length ? (
                    <div className="arabic-input-tools" aria-label="أدوات كتابة الحروف والحركات">
                      {section.inputTools.map((token, index) => (
                        <button type="button" key={token + index} onClick={() => {
                          setAnswers(current => ({ ...current, [section.id]: (current[section.id] ?? "") + token }));
                          setChecked(current => ({ ...current, [section.id]: false }));
                          setFeedback(current => ({ ...current, [section.id]: "" }));
                        }}>{token}</button>
                      ))}
                      <button type="button" className="clear-arabic-input" onClick={() => {
                        setAnswers(current => ({ ...current, [section.id]: "" }));
                        setChecked(current => ({ ...current, [section.id]: false }));
                        setFeedback(current => ({ ...current, [section.id]: "" }));
                      }}>مسح</button>
                    </div>
                  ) : null}
                </div>
              ) : (
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
              )}
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

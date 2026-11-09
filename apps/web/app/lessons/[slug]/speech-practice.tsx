"use client";

import { useState } from "react";

type RecognitionResult = { [index: number]: { transcript: string } };
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };
type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => RecognitionInstance;
  webkitSpeechRecognition?: new () => RecognitionInstance;
};

function normalizeArabic(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[،؛؟.!,:;'"“”]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export default function SpeechPractice({ target }: { target: string }) {
  const [status, setStatus] = useState<"idle" | "listening" | "matched" | "retry" | "unsupported">("idle");
  const [heard, setHeard] = useState("");
  const [message, setMessage] = useState("");
  const [recognition, setRecognition] = useState<RecognitionInstance | null>(null);

  function startPractice() {
    const browserWindow = window as RecognitionWindow;
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("unsupported");
      setMessage("المتصفح لا يدعم التعرف على الكلام هنا. يمكنك الاستماع إلى النطق الصحيح والمحاولة في متصفح Chrome حديث.");
      return;
    }

    setHeard("");
    setMessage("استمع النظام إلى نطقك. تحدث الآن بوضوح.");
    const instance = new Recognition();
    instance.lang = "ar-SA";
    instance.interimResults = false;
    instance.maxAlternatives = 3;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
      if (normalizeArabic(transcript) === normalizeArabic(target)) {
        setStatus("matched");
        setMessage("تعرّف النظام على الكلمة كما هي. أحسنت! هذا فحص للتعرّف على الكلام وليس حكماً صوتياً متخصصاً على مخارج الحروف.");
      } else {
        setStatus("retry");
        setMessage("لم يتعرّف النظام على الكلمة بالشكل المطلوب. استمع مرة أخرى ثم حاول ببطء.");
      }
    };
    instance.onerror = (event) => {
      setStatus("retry");
      setMessage(event.error === "not-allowed"
        ? "لم تسمح للمتصفح باستخدام الميكروفون. فعّل إذن الميكروفون ثم أعد المحاولة."
        : "لم نتمكن من التقاط الكلمة. تحقق من الميكروفون والاتصال ثم أعد المحاولة.");
    };
    instance.onend = () => setRecognition(null);
    setRecognition(instance);
    setStatus("listening");
    try {
      instance.start();
    } catch {
      setRecognition(null);
      setStatus("retry");
      setMessage("تعذر بدء التسجيل. حاول مرة أخرى.");
    }
  }

  function stopPractice() {
    recognition?.stop();
    setRecognition(null);
    setStatus("idle");
    setMessage("تم إيقاف الاستماع.");
  }

  return (
    <div className="speech-practice" dir="rtl">
      <button type="button" className="speech-practice-button" onClick={status === "listening" ? stopPractice : startPractice}>
        {status === "listening" ? "إيقاف الاستماع" : "🎙️ انطق الكلمة وكرّرها"}
      </button>
      {message && <p className={status === "matched" ? "speech-feedback speech-success" : "speech-feedback"} role="status">{message}</p>}
      {heard && <p className="speech-heard">ما سمعه النظام: <strong>{heard}</strong></p>}
    </div>
  );
}

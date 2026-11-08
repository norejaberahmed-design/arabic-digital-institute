"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AccountPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { data: session, isPending } = authClient.useSession();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) setMessage(result.error.message || "تعذر إكمال العملية. تحقق من البيانات وحاول مجدداً.");
      else window.location.href = "/dashboard";
    } catch {
      setMessage("تعذر الاتصال بالخادم. تأكد من إعداد قاعدة البيانات ثم حاول مجدداً.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await authClient.signOut();
    window.location.reload();
  }

  async function deleteAccount() {
    if (deleteConfirmation !== "DELETE" || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) throw new Error("تعذر حذف الحساب الآن. حاول مرة أخرى.");
      window.location.href = "/";
    } catch (reason) {
      setDeleteError(reason instanceof Error ? reason.message : "تعذر حذف الحساب.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell lessons-shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">ع</span><span>المعهد الرقمي</span></Link>
        <Link className="level-link" href="/lessons">الدروس ←</Link>
      </header>
      <section className="account-panel">
        <p className="section-kicker">LEARNER ACCOUNT</p>
        {isPending ? <p>جارٍ التحقق من الحساب...</p> : session?.user ? (
          <>
            <h1>مرحباً، {session.user.name}</h1>
            <p className="muted">تم تسجيل الدخول بالحساب {session.user.email}</p>
            <button className="primary-action" type="button" onClick={signOut}>تسجيل الخروج</button>
            <Link className="level-link back-link" href="/dashboard">لوحة التقدم ←</Link>
            <section className="delete-account-panel">
              <h2>حذف الحساب والبيانات</h2>
              <p>سيؤدي هذا إلى حذف حسابك وجلسات الدخول وسجل التعلم ومحاولات الاختبارات المرتبطة به. لا يمكن التراجع عن هذا الإجراء.</p>
              <label>اكتب DELETE للتأكيد<input value={deleteConfirmation} onChange={event => setDeleteConfirmation(event.target.value)} autoComplete="off" /></label>
              <button className="danger-action" type="button" disabled={deleteConfirmation !== "DELETE" || busy} onClick={deleteAccount}>حذف الحساب نهائياً</button>
              {deleteError && <p className="answer-feedback incorrect">{deleteError}</p>}
            </section>
          </>
        ) : (
          <>
            <h1>{mode === "signup" ? "أنشئ حسابك وابدأ التعلم" : "مرحباً بعودتك"}</h1>
            <p className="muted">احفظ تقدمك وتابع دروس العربية من أي جهاز.</p>
            <div className="auth-tabs">
              <button type="button" className={mode === "signup" ? "auth-tab active" : "auth-tab"} onClick={() => { setMode("signup"); setMessage(""); }}>حساب جديد</button>
              <button type="button" className={mode === "signin" ? "auth-tab active" : "auth-tab"} onClick={() => { setMode("signin"); setMessage(""); }}>تسجيل الدخول</button>
            </div>
            <form className="auth-form" onSubmit={submit}>
              {mode === "signup" && <label>الاسم<input autoComplete="name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} /></label>}
              <label>البريد الإلكتروني<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>
              <label>كلمة المرور<input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={10} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label>
              <button className="primary-action" type="submit" disabled={busy}>{busy ? "جارٍ التنفيذ..." : mode === "signup" ? "إنشاء الحساب" : "تسجيل الدخول"}</button>
            </form>
            {message && <p className="answer-feedback incorrect" role="alert">{message}</p>}
            <p className="account-note">لا نطلب معلومات دفع. استخدم بريداً إلكترونياً تملكه وكلمة مرور فريدة.</p>
          </>
        )}
      </section>
    </main>
  );
}

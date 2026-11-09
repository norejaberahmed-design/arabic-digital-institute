import { authClient } from "./auth-client";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiBaseUrl = configuredUrl ? configuredUrl.replace(/\/$/, "") : "";

function apiErrorMessage(code?: string, fallback = "تعذر تنفيذ العملية.") {
  if (code === "LESSON_REQUIREMENTS_INCOMPLETE") {
    return "أكمل جميع التمارين المطلوبة بإجابة صحيحة قبل إنهاء الدرس.";
  }
  return code || fallback;
}

export async function apiGet<T>(path: string): Promise<T> {
  if (!apiBaseUrl) throw new Error("أضف EXPO_PUBLIC_API_URL إلى إعدادات تطبيق الهاتف.");
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(response.status === 503 ? "الخادم أو قاعدة البيانات غير جاهزين." : "تعذر تحميل البيانات.");
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  if (!apiBaseUrl) throw new Error("أضف EXPO_PUBLIC_API_URL إلى إعدادات تطبيق الهاتف.");
  const cookie = await authClient.getCookie();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    credentials: "omit",
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) {
    if (response.status === 401) throw new Error("سجّل الدخول أولاً حتى نحفظ تقدمك.");
    throw new Error(apiErrorMessage(result.error, "تعذر حفظ البيانات."));
  }
  return result as T;
}

export async function apiGetAuthenticated<T>(path: string): Promise<T> {
  if (!apiBaseUrl) throw new Error("أضف EXPO_PUBLIC_API_URL إلى إعدادات تطبيق الهاتف.");
  const cookie = await authClient.getCookie();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: "omit",
  });
  const result = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) {
    if (response.status === 401) throw new Error("سجّل الدخول أولاً لعرض تقدمك.");
    throw new Error(result.error || "تعذر تحميل البيانات.");
  }
  return result as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  if (!apiBaseUrl) throw new Error("أضف EXPO_PUBLIC_API_URL إلى إعدادات تطبيق الهاتف.");
  const cookie = await authClient.getCookie();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "DELETE",
    headers: cookie ? { Cookie: cookie } : {},
    credentials: "omit",
  });
  const result = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) {
    if (response.status === 401) throw new Error("انتهت جلسة الدخول. سجّل الدخول مرة أخرى.");
    throw new Error(result.error || "تعذر تنفيذ العملية.");
  }
  return result as T;
}

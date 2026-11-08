const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiBaseUrl = configuredUrl ? configuredUrl.replace(/\/$/, "") : "";

export async function apiGet<T>(path: string): Promise<T> {
  if (!apiBaseUrl) throw new Error("أضف EXPO_PUBLIC_API_URL إلى إعدادات تطبيق الهاتف.");
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(response.status === 503 ? "الخادم أو قاعدة البيانات غير جاهزين." : "تعذر تحميل البيانات.");
  return response.json() as Promise<T>;
}

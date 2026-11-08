import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { apiDelete } from "../lib/api";
import { authClient } from "../lib/auth-client";

export default function AccountScreen() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { data: session, isPending } = authClient.useSession();

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) setMessage(result.error.message || "تحقق من البيانات وحاول مجدداً.");
      else router.replace("/dashboard");
    } catch {
      setMessage("تعذر الاتصال بالخادم. تحقق من عنوان الخدمة وحاول مجدداً.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    if (deleteConfirmation !== "DELETE" || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      await apiDelete("/api/account");
      router.replace("/");
    } catch (reason) {
      setDeleteError(reason instanceof Error ? reason.message : "تعذر حذف الحساب.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await authClient.signOut();
    setMessage("تم تسجيل الخروج.");
  }

  if (isPending) return <View style={styles.center}><ActivityIndicator color="#245b49" /></View>;

  return (
    <View style={styles.screen}>
      <Link href="/" style={styles.back}>← الرئيسية</Link>
      <Text style={styles.kicker}>LEARNER ACCOUNT</Text>
      {session?.user ? <>
        <Text style={styles.title}>مرحباً، {session.user.name}</Text>
        <Text style={styles.muted}>{session.user.email}</Text>
        <Pressable style={styles.button} onPress={() => router.replace("/dashboard")}><Text style={styles.buttonText}>متابعة التعلم</Text></Pressable>
        <Pressable style={styles.secondary} onPress={signOut}><Text style={styles.secondaryText}>تسجيل الخروج</Text></Pressable>
        <Text style={styles.deleteTitle}>حذف الحساب والبيانات</Text>
        <Text style={styles.muted}>اكتب DELETE لتأكيد حذف حسابك وسجل تعلمك نهائياً.</Text>
        <TextInput style={styles.input} value={deleteConfirmation} onChangeText={setDeleteConfirmation} autoCapitalize="characters" placeholder="DELETE" />
        <Pressable style={[styles.deleteButton, (deleteConfirmation !== "DELETE" || busy) && styles.disabled]} disabled={deleteConfirmation !== "DELETE" || busy} onPress={deleteAccount}><Text style={styles.buttonText}>حذف الحساب نهائياً</Text></Pressable>
        {!!deleteError && <Text style={styles.message}>{deleteError}</Text>}
      </> : <>
        <Text style={styles.title}>{mode === "signup" ? "أنشئ حسابك" : "تسجيل الدخول"}</Text>
        <Text style={styles.muted}>احفظ تقدمك وتابع تعلم العربية من هاتفك.</Text>
        <View style={styles.tabs}>
          <Pressable onPress={() => { setMode("signup"); setMessage(""); }}><Text style={mode === "signup" ? styles.activeTab : styles.tab}>حساب جديد</Text></Pressable>
          <Pressable onPress={() => { setMode("signin"); setMessage(""); }}><Text style={mode === "signin" ? styles.activeTab : styles.tab}>دخول</Text></Pressable>
        </View>
        {mode === "signup" && <TextInput style={styles.input} placeholder="الاسم" value={name} onChangeText={setName} autoComplete="name" />}
        <TextInput style={styles.input} placeholder="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <TextInput style={styles.input} placeholder="كلمة المرور (10 أحرف على الأقل)" value={password} onChangeText={setPassword} secureTextEntry autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        <Pressable style={[styles.button, busy && styles.disabled]} disabled={busy} onPress={submit}><Text style={styles.buttonText}>{busy ? "جارٍ التنفيذ..." : mode === "signup" ? "إنشاء الحساب" : "تسجيل الدخول"}</Text></Pressable>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f2", padding: 24, paddingTop: 55 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f7f6f2" },
  back: { color: "#245b49", marginBottom: 32, fontSize: 13 },
  kicker: { color: "#c4a875", fontWeight: "700", letterSpacing: 2, fontSize: 11 },
  title: { color: "#173e33", fontSize: 29, fontWeight: "700", marginTop: 10 },
  muted: { color: "#718078", lineHeight: 23, marginTop: 7 },
  tabs: { flexDirection: "row", gap: 25, marginTop: 24, marginBottom: 15 },
  tab: { color: "#718078", paddingBottom: 8 },
  activeTab: { color: "#245b49", fontWeight: "700", borderBottomWidth: 2, borderBottomColor: "#245b49", paddingBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e7e6df", borderRadius: 9, padding: 14, marginBottom: 12, textAlign: "right" },
  button: { backgroundColor: "#245b49", padding: 15, borderRadius: 9, marginTop: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  secondary: { padding: 14, alignItems: "center", marginTop: 10 },
  secondaryText: { color: "#245b49", fontWeight: "700" },
  disabled: { opacity: 0.6 },
  deleteTitle: { color: "#8b4035", fontSize: 17, fontWeight: "700", marginTop: 32 },
  deleteButton: { backgroundColor: "#8b4035", padding: 14, borderRadius: 9, marginTop: 8, alignItems: "center" },
  message: { color: "#9a493b", marginTop: 15, lineHeight: 22 },
});

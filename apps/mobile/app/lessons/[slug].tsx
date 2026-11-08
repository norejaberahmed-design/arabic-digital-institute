import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { apiGet, apiPost } from "../../lib/api";

type Lesson = {
  title: string; summary: string; objective: string; durationMin: number;
  level: { code: string; title: string };
  content: { sections?: Array<{
    id: string; type: string; title: string; prompt?: string;
    lines?: Array<{ speaker: string; arabic: string; transliteration: string; english: string }>;
    items?: Array<{ arabic: string; transliteration: string; english: string }>;
    options?: Array<{ id: string; label: string }>;
  }> };
};

export default function LessonDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    if (typeof slug !== "string") return;
    apiGet<{ data: Lesson }>(`/api/lessons/${encodeURIComponent(slug)}`)
      .then(result => { if (active) setLesson(result.data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "تعذر تحميل الدرس."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  async function submitAnswer(activityId: string) {
    if (!selected || typeof slug !== "string" || busy) return;
    setBusy(true);
    setFeedback("");
    try {
      const result = await apiPost<{ data: { isCorrect: boolean; explanation?: string } }>("/api/progress", {
        action: "attempt", lessonSlug: slug, activityId, answer: selected,
      });
      setCorrect(result.data.isCorrect);
      setFeedback(result.data.isCorrect ? "إجابة صحيحة! أحسنت. " + (result.data.explanation || "") : "حاول مرة أخرى. " + (result.data.explanation || ""));
    } catch (reason) {
      setFeedback(reason instanceof Error ? reason.message : "تعذر حفظ الإجابة.");
    } finally {
      setBusy(false);
    }
  }

  async function finishLesson() {
    if (typeof slug !== "string" || busy) return;
    setBusy(true);
    try {
      await apiPost("/api/progress", { action: "complete", lessonSlug: slug });
      setCompleted(true);
      setFeedback("تم حفظ إكمال الدرس في حسابك.");
    } catch (reason) {
      setFeedback(reason instanceof Error ? reason.message : "تعذر حفظ التقدم.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Link href="/lessons" style={styles.back}>← قائمة الدروس</Link>
      {loading && <ActivityIndicator size="large" color="#245b49" />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {lesson && <>
        <Text style={styles.level}>{lesson.level.code.replace("_", "-")} · {lesson.durationMin} دقائق</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.muted}>{lesson.summary}</Text>
        <Text style={styles.objective}>هدف الدرس: {lesson.objective}</Text>
        {lesson.content.sections?.map(section => <View key={section.id} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.lines?.map((line, i) => <View key={i} style={styles.word}>
            <Text style={styles.arabic}>{line.arabic}</Text>
            <Text style={styles.translit}>{line.transliteration}</Text>
            <Text style={styles.muted}>{line.english}</Text>
          </View>)}
          {section.items?.map(item => <View key={item.arabic} style={styles.word}>
            <Text style={styles.arabic}>{item.arabic}</Text>
            <Text style={styles.translit}>{item.transliteration}</Text>
            <Text style={styles.muted}>{item.english}</Text>
          </View>)}
          {section.prompt && <>
            <Text style={styles.prompt}>{section.prompt}</Text>
            {section.options?.map(option => <Pressable key={option.id} onPress={() => { setSelected(option.id); setFeedback(""); }} style={[styles.option, selected === option.id && styles.optionSelected]}>
              <Text style={styles.optionText}>{option.label}</Text>
            </Pressable>)}
            <Pressable style={styles.button} disabled={!selected || busy} onPress={() => submitAnswer(section.id)}><Text style={styles.buttonText}>{busy ? "جارٍ التحقق..." : "تحقق واحفظ الإجابة"}</Text></Pressable>
          </>}
        </View>)}
        {!!feedback && <Text style={correct ? styles.success : styles.error}>{feedback}</Text>}
        <Pressable style={[styles.button, completed && styles.done]} disabled={busy || completed} onPress={finishLesson}><Text style={styles.buttonText}>{completed ? "اكتمل الدرس" : "إنهاء الدرس وحفظ التقدم"}</Text></Pressable>
        <Link href="/account" style={styles.accountLink}>إدارة الحساب / تسجيل الدخول</Link>
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f2" },
  content: { padding: 22, paddingBottom: 44 },
  back: { color: "#245b49", fontSize: 13, marginBottom: 28 },
  level: { color: "#9a8358", fontWeight: "700", fontSize: 12 },
  title: { color: "#173e33", fontSize: 30, fontWeight: "700", marginTop: 8 },
  muted: { color: "#718078", fontSize: 13, lineHeight: 22, marginTop: 4 },
  objective: { color: "#245b49", fontSize: 13, lineHeight: 22, marginTop: 14 },
  card: { backgroundColor: "#fff", borderColor: "#e7e6df", borderWidth: 1, borderRadius: 13, padding: 18, marginTop: 14 },
  sectionTitle: { color: "#173e33", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  word: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0efe9" },
  arabic: { color: "#173e33", fontSize: 24, fontWeight: "700", textAlign: "right" },
  translit: { color: "#9a8358", fontSize: 13, marginTop: 2 },
  prompt: { color: "#173e33", fontWeight: "700", fontSize: 15, lineHeight: 24, marginTop: 10, marginBottom: 8 },
  option: { borderWidth: 1, borderColor: "#e7e6df", backgroundColor: "#fff", padding: 13, borderRadius: 8, marginTop: 7 },
  optionSelected: { borderColor: "#245b49", backgroundColor: "#edf2ec" },
  optionText: { color: "#173e33", textAlign: "right" },
  button: { backgroundColor: "#245b49", padding: 14, borderRadius: 9, marginTop: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  done: { backgroundColor: "#718078" },
  success: { color: "#245b49", backgroundColor: "#e7f2e8", padding: 12, borderRadius: 8, marginTop: 14, lineHeight: 22 },
  error: { color: "#9a493b", marginTop: 14, lineHeight: 24 },
  accountLink: { color: "#245b49", textAlign: "center", marginTop: 18 },
});

import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { apiGet } from "../../lib/api";

type Lesson = { id: string; slug: string; title: string; summary: string; objective: string; durationMin: number; level: { code: string; title: string } };

export default function LessonsScreen() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiGet<{ data: Lesson[] }>("/api/lessons")
      .then(result => { if (active) setLessons(result.data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "تعذر تحميل الدروس."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Link href="/" style={styles.back}>← الرئيسية</Link>
      <Text style={styles.kicker}>LEARN ARABIC</Text>
      <Text style={styles.title}>دروسك الأولى</Text>
      <Text style={styles.muted}>دروس قصيرة وعملية لتبدأ استخدام العربية.</Text>
      {loading && <ActivityIndicator size="large" color="#245b49" style={styles.loader} />}
      {!!error && <View style={styles.message}><Text style={styles.messageTitle}>تعذر الاتصال</Text><Text style={styles.muted}>{error}</Text></View>}
      {!loading && !error && lessons.length === 0 && <View style={styles.message}><Text style={styles.messageTitle}>لا توجد دروس منشورة حالياً</Text></View>}
      {lessons.map((lesson, index) => (
        <Link key={lesson.id} href={{ pathname: "/lessons/[slug]", params: { slug: lesson.slug } }} asChild>
          <Pressable style={styles.card}>
            <View style={styles.row}><Text style={styles.level}>{lesson.level.code.replace("_", "-")}</Text><Text style={styles.number}>0{index + 1}</Text></View>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.muted}>{lesson.summary}</Text>
            <Text style={styles.action}>افتح الدرس ←</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f2" },
  content: { padding: 22, paddingBottom: 42 },
  back: { color: "#245b49", fontSize: 13, marginBottom: 28 },
  kicker: { color: "#c4a875", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  title: { color: "#173e33", fontSize: 32, fontWeight: "700", marginTop: 8 },
  muted: { color: "#718078", fontSize: 14, lineHeight: 24, marginTop: 6 },
  loader: { marginTop: 40 },
  message: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginTop: 24 },
  messageTitle: { color: "#173e33", fontWeight: "700", fontSize: 16 },
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e7e6df", borderRadius: 13, padding: 19, marginTop: 14 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  level: { color: "#245b49", backgroundColor: "#e5ece5", borderRadius: 5, paddingHorizontal: 9, paddingVertical: 5, overflow: "hidden", fontSize: 11, fontWeight: "700" },
  number: { color: "#b2b9b2" },
  cardTitle: { color: "#173e33", fontSize: 19, fontWeight: "700", marginTop: 16 },
  action: { color: "#245b49", fontWeight: "700", marginTop: 18 },
});

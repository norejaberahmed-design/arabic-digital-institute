import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { authClient } from "../lib/auth-client";
import { apiGetAuthenticated } from "../lib/api";

type Progress = { lessonId: string; completed: boolean; lastPosition: number; lesson: { slug: string; title: string; level: { code: string } } };

export default function DashboardScreen() {
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGetAuthenticated<{ data: Progress[] }>("/api/progress")
      .then(result => { if (active) setItems(result.data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "تعذر تحميل التقدم."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (isPending) return <View style={styles.center}><ActivityIndicator color="#245b49" /></View>;
  if (!session?.user) return <View style={styles.screen}><Text style={styles.title}>سجّل الدخول لمتابعة تقدمك</Text><Link href="/account" style={styles.link}>فتح الحساب ←</Link></View>;

  const completed = items.filter(item => item.completed).length;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Link href="/" style={styles.link}>← الرئيسية</Link>
      <Text style={styles.kicker}>LEARNER DASHBOARD</Text>
      <Text style={styles.title}>مرحباً، {session.user.name}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNumber}>{completed}</Text><Text style={styles.muted}>دروس مكتملة</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{items.length}</Text><Text style={styles.muted}>دروس بدأت بها</Text></View>
      </View>
      {loading && <ActivityIndicator color="#245b49" />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && items.length === 0 && <Text style={styles.muted}>لم تبدأ أي درس بعد. ابدأ من قائمة الدروس.</Text>}
      {items.map(item => <Link key={item.lessonId} href={{ pathname: "/lessons/[slug]", params: { slug: item.lesson.slug } }} asChild>
        <Pressable style={styles.card}>
          <Text style={styles.level}>{item.lesson.level.code.replace("_", "-")}</Text>
          <Text style={styles.cardTitle}>{item.lesson.title}</Text>
          <Text style={styles.muted}>{item.completed ? "مكتمل" : "قيد التعلم"} · متابعة ←</Text>
        </Pressable>
      </Link>)}
      <Link href="/lessons" style={styles.link}>استعراض جميع الدروس ←</Link>
      <Pressable style={styles.signOut} onPress={async () => { await authClient.signOut(); }}><Text style={styles.link}>تسجيل الخروج</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f2" },
  content: { padding: 22, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f7f6f2" },
  link: { color: "#245b49", fontWeight: "700", marginBottom: 24 },
  kicker: { color: "#c4a875", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  title: { color: "#173e33", fontSize: 28, fontWeight: "700", marginTop: 10 },
  stats: { flexDirection: "row", gap: 10, marginVertical: 22 },
  stat: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e7e6df", borderRadius: 12, padding: 16 },
  statNumber: { color: "#245b49", fontSize: 26, fontWeight: "700" },
  muted: { color: "#718078", fontSize: 13, lineHeight: 22, marginTop: 5 },
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e7e6df", borderRadius: 12, padding: 16, marginBottom: 10 },
  level: { color: "#9a8358", fontSize: 11, fontWeight: "700" },
  cardTitle: { color: "#173e33", fontSize: 17, fontWeight: "700", marginTop: 7 },
  error: { color: "#9a493b", marginVertical: 15 },
  signOut: { marginTop: 24 },
});

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

const colors = {
  olive: "#245b49",
  dark: "#173e33",
  paper: "#f7f6f2",
  muted: "#718078",
  sand: "#c4a875",
  white: "#ffffff",
};

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.brandMark}><Text style={styles.brandLetter}>ع</Text></View>
        <Text style={styles.brand}>المعهد الرقمي</Text>
        <Pressable onPress={() => router.push("/account")}><Text style={styles.language}>حسابي</Text></Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ARABIC DIGITAL INSTITUTE</Text>
        <Text style={styles.title}>العربية، خطوة{"\n"}بخطوة.</Text>
        <Text style={styles.description}>تعلم العربية التي تستخدمها في الحياة الحقيقية. استمع، تحدث، اقرأ، واكتب — كل يوم.</Text>
        <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.push("/lessons")}>
          <Text style={styles.buttonText}>ابدأ رحلة التعلم</Text>
          <Text style={styles.buttonArrow}>←</Text>
        </Pressable>
        <Text style={styles.note}>دروس قصيرة · تعلم من هاتفك · تقدم على مستواك</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.kicker}>مسارك التعليمي</Text>
        <Text style={styles.sectionTitle}>اختر نقطة البداية</Text>
        <Text style={styles.sectionDescription}>ابدأ من مستواك، وسنبني مهاراتك بالتدريج.</Text>
      </View>

      <View style={styles.levelCard}>
        <View style={styles.cardTop}>
          <Text style={styles.levelCode}>PRE-A1</Text>
          <Text style={styles.levelNumber}>01</Text>
        </View>
        <Text style={styles.cardTitle}>البداية مع العربية</Text>
        <Text style={styles.cardDescription}>الحروف والتحية والتعارف</Text>
        <Text style={styles.cardAction}>ابدأ الآن ←</Text>
      </View>
      <View style={styles.levelCard}>
        <View style={styles.cardTop}>
          <Text style={styles.levelCode}>A1</Text>
          <Text style={styles.levelNumber}>02</Text>
        </View>
        <Text style={styles.cardTitle}>الحياة اليومية</Text>
        <Text style={styles.cardDescription}>الأسرة والطعام والوقت والأماكن</Text>
        <Text style={styles.comingSoon}>قريباً</Text>
      </View>
      <Text style={styles.footer}>تعلم لغة، وافتح عالماً.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 22, paddingBottom: 36 },
  header: { height: 68, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e7e6df", gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.olive, alignItems: "center", justifyContent: "center" },
  brandLetter: { color: colors.white, fontSize: 23, fontWeight: "700" },
  brand: { color: colors.dark, fontSize: 16, fontWeight: "700", flex: 1 },
  language: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  hero: { paddingTop: 34, paddingBottom: 34 },
  eyebrow: { color: colors.sand, fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  title: { color: colors.dark, fontSize: 47, lineHeight: 62, fontWeight: "700", marginTop: 14, textAlign: "right" },
  description: { color: colors.muted, fontSize: 15, lineHeight: 29, marginTop: 10, textAlign: "right" },
  button: { marginTop: 20, backgroundColor: colors.olive, borderRadius: 9, paddingVertical: 15, paddingHorizontal: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  buttonArrow: { color: colors.white, fontSize: 18 },
  note: { color: "#87928c", fontSize: 11, marginTop: 15, textAlign: "right" },
  section: { borderTopWidth: 1, borderTopColor: "#e7e6df", paddingTop: 22, paddingBottom: 16 },
  kicker: { color: colors.sand, fontSize: 12, fontWeight: "700" },
  sectionTitle: { color: colors.dark, fontSize: 24, fontWeight: "700", marginTop: 4 },
  sectionDescription: { color: colors.muted, fontSize: 13, marginTop: 5 },
  levelCard: { backgroundColor: colors.white, borderColor: "#e7e6df", borderWidth: 1, borderRadius: 13, padding: 19, marginBottom: 11 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  levelCode: { color: colors.olive, backgroundColor: "#e5ece5", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 5, overflow: "hidden", fontSize: 10, fontWeight: "700" },
  levelNumber: { color: "#b2b9b2", fontSize: 12 },
  cardTitle: { color: colors.dark, fontSize: 19, fontWeight: "700", marginTop: 18 },
  cardDescription: { color: colors.muted, fontSize: 13, marginTop: 5 },
  cardAction: { color: colors.olive, fontSize: 13, fontWeight: "700", marginTop: 18 },
  comingSoon: { color: colors.muted, fontSize: 12, marginTop: 18 },
  footer: { color: "#8a958e", textAlign: "center", fontSize: 12, marginTop: 22 },
});

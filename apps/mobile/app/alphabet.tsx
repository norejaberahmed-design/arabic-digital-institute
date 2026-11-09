import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";

const letters = [
  ["ا","ألف","Alif","ا","ا","ـا","ـا","coral"],
  ["ب","باء","Ba","ب","بـ","ـبـ","ـب","blue"],
  ["ت","تاء","Ta","ت","تـ","ـتـ","ـت","mint"],
  ["ث","ثاء","Tha","ث","ثـ","ـثـ","ـث","violet"],
  ["ج","جيم","Jim","ج","جـ","ـجـ","ـج","amber"],
  ["ح","حاء","Ha","ح","حـ","ـحـ","ـح","rose"],
  ["خ","خاء","Kha","خ","خـ","ـخـ","ـخ","sky"],
  ["د","دال","Dal","د","د","ـد","ـد","mint"],
  ["ذ","ذال","Dhal","ذ","ذ","ـذ","ـذ","violet"],
  ["ر","راء","Ra","ر","ر","ـر","ـر","amber"],
  ["ز","زاي","Zay","ز","ز","ـز","ـز","blue"],
  ["س","سين","Sin","س","سـ","ـسـ","ـس","sky"],
  ["ش","شين","Shin","ش","شـ","ـشـ","ـش","rose"],
  ["ص","صاد","Sad","ص","صـ","ـصـ","ـص","coral"],
  ["ض","ضاد","Dad","ض","ضـ","ـضـ","ـض","amber"],
  ["ط","طاء","Ta","ط","طـ","ـطـ","ـط","mint"],
  ["ظ","ظاء","Za","ظ","ظـ","ـظـ","ـظ","violet"],
  ["ع","عين","Ayn","ع","عـ","ـعـ","ـع","rose"],
  ["غ","غين","Ghayn","غ","غـ","ـغـ","ـغ","sky"],
  ["ف","فاء","Fa","ف","فـ","ـفـ","ـف","blue"],
  ["ق","قاف","Qaf","ق","قـ","ـقـ","ـق","coral"],
  ["ك","كاف","Kaf","ك","كـ","ـكـ","ـك","mint"],
  ["ل","لام","Lam","ل","لـ","ـلـ","ـل","violet"],
  ["م","ميم","Mim","م","مـ","ـمـ","ـم","rose"],
  ["ن","نون","Nun","ن","نـ","ـنـ","ـن","amber"],
  ["ه","هاء","Ha","ه","هـ","ـهـ","ـه","sky"],
  ["و","واو","Waw","و","و","ـو","ـو","blue"],
  ["ي","ياء","Ya","ي","يـ","ـيـ","ـي","mint"],
] as const;

const tones: Record<string, { bg: string; ink: string; border: string }> = {
  coral: { bg: "#fff0ec", ink: "#e66c58", border: "#f6d7d0" },
  blue: { bg: "#eaf2ff", ink: "#477ed4", border: "#d6e4fb" },
  mint: { bg: "#e8f8f0", ink: "#299b73", border: "#cfeedd" },
  violet: { bg: "#f0edff", ink: "#7564d8", border: "#ded9fb" },
  amber: { bg: "#fff5df", ink: "#c28a28", border: "#f4e4bc" },
  rose: { bg: "#ffedf4", ink: "#d15f8a", border: "#f6d6e3" },
  sky: { bg: "#e8f7fb", ink: "#318eaa", border: "#cdebf2" },
};

export default function AlphabetScreen() {
  const [selected, setSelected] = useState("ا");
  const [query, setQuery] = useState("");
  const current = letters.find(letter => letter[0] === selected) ?? letters[0];
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return letters.filter(letter => !value || letter[0].includes(value) || letter[1].includes(value) || letter[2].toLowerCase().includes(value));
  }, [query]);
  const tone = tones[current[7]];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Link href="/" style={styles.back}>← الرئيسية</Link>
        <Text style={styles.headerTitle}>الأبجدية العربية</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.kicker}>PRE-A1 · LETTER STUDIO</Text>
        <Text style={styles.title}>اكتشف 28 حرفاً</Text>
        <Text style={styles.subtitle}>تعرّف على الحروف وأشكالها في أول الكلمة ووسطها وآخرها.</Text>
      </View>
      <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن حرف أو اسمه" placeholderTextColor="#9ba1b2" style={styles.search} />
      <View style={styles.grid} >
        {filtered.map(letter => {
          const color = tones[letter[7]];
          const active = selected === letter[0];
          return (
            <Pressable key={letter[0]} onPress={() => setSelected(letter[0])} accessibilityRole="button" accessibilityState={{ selected: active }} style={[styles.tile, { backgroundColor: color.bg, borderColor: active ? color.ink : color.border, borderWidth: active ? 2 : 1 }]}>
              <Text style={[styles.letter, { color: color.ink }]}>{letter[0]}</Text>
              <Text style={[styles.tileName, { color: color.ink }]}>{letter[1]}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.detail, { borderColor: tone.border }]}>
        <View style={[styles.bigLetter, { backgroundColor: tone.bg }]}>
          <Text style={[styles.bigGlyph, { color: tone.ink }]}>{current[0]}</Text>
          <Text style={[styles.bigName, { color: tone.ink }]}>{current[1]} · {current[2]}</Text>
        </View>
        <Text style={styles.sectionTitle}>أشكال الحرف</Text>
        <View style={styles.forms} >
          {["منفصل","أول الكلمة","وسط الكلمة","آخر الكلمة"].map((label, index) => (
            <View key={label} style={styles.form}>
              <Text style={styles.formGlyph}>{current[index + 3]}</Text>
              <Text style={styles.formLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>الأصوات المرجعية ستُسجل من متحدثين عرب وتُراجع قبل إضافتها. لا نستخدم صوتاً آلياً غير موثوق كنموذج للنطق.</Text>
      </View>
      <Text style={styles.footer}>تعلّم الحرف، ثم جرّبه داخل كلمة.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8f8fc" },
  content: { padding: 18, paddingBottom: 40 },
  header: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#e9eaf2", paddingBottom: 12 },
  back: { color: "#5c55d9", fontSize: 12, fontWeight: "700" },
  headerTitle: { color: "#252b42", fontSize: 15, fontWeight: "700" },
  hero: { paddingTop: 24, paddingBottom: 16 },
  kicker: { color: "#858ca2", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title: { color: "#252b42", fontSize: 29, fontWeight: "800", marginTop: 8 },
  subtitle: { color: "#747b91", fontSize: 13, lineHeight: 23, marginTop: 5, textAlign: "right" },
  search: { height: 46, borderWidth: 1, borderColor: "#e7e8f0", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 13, color: "#343a52", textAlign: "right", marginBottom: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" },
  tile: { width: "22.5%", minHeight: 75, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 1 },
  letter: { fontSize: 31, lineHeight: 38, fontWeight: "700" },
  tileName: { fontSize: 9, fontWeight: "600" },
  detail: { marginTop: 18, borderWidth: 1, borderRadius: 17, padding: 13, backgroundColor: "#fff" },
  bigLetter: { minHeight: 125, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  bigGlyph: { fontSize: 68, lineHeight: 78, fontWeight: "700" },
  bigName: { fontSize: 12, fontWeight: "700" },
  sectionTitle: { fontSize: 14, color: "#343a52", fontWeight: "700", marginTop: 18, marginBottom: 9, textAlign: "right" },
  forms: { flexDirection: "row", gap: 6 },
  form: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: "#ececf3", borderRadius: 10, paddingVertical: 8, alignItems: "center", backgroundColor: "#fcfcfe" },
  formGlyph: { fontSize: 25, color: "#454b65" },
  formLabel: { fontSize: 8, color: "#858ba0", marginTop: 3 },
  note: { color: "#8581aa", backgroundColor: "#f5f4ff", borderRadius: 10, padding: 10, fontSize: 10, lineHeight: 18, marginTop: 13, textAlign: "right" },
  footer: { textAlign: "center", color: "#969caf", fontSize: 11, marginTop: 20 },
});

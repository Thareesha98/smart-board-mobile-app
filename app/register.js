import { useState, useRef } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../client/api";
import AuthProgress from "../components/AuthProgress";

/* ---------------- PASSWORD STRENGTH ---------------- */
const strengthLabel = (v) => {
  if (v.length < 6) return { t: "Weak", c: "#ef4444", w: "30%" };
  if (/[A-Z]/.test(v) && /\d/.test(v)) return { t: "Strong", c: "#22c55e", w: "100%" };
  return { t: "Medium", c: "#facc15", w: "60%" };
};

export default function Register() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "MALE",
    role: "STUDENT",
    studentUniversity: "",
    nicNumber: "",
    accNo: "",
  });

  const strength = strengthLabel(form.password);

  const next = () => {
    Animated.timing(progress, {
      toValue: step,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setStep(step + 1);
  };

  const submit = async () => {
    try {
      await api.post("/auth/register/request", form);
      router.push({
  pathname: "/verify-otp",
  params: {
    email: form.email,
    mode: "register",
  },
});

    } catch {
      Alert.alert("Registration Failed", "Check your details");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <AuthProgress step={1} />
        <Text style={styles.logo}>SBMS</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progress.interpolate({ inputRange: [0, 1, 2], outputRange: ["33%", "66%", "100%"] }) },
            ]}
          />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Input icon="person" placeholder="Full Name" onChangeText={(v) => setForm({ ...form, fullName: v })} />
              <Input icon="mail" placeholder="Email" onChangeText={(v) => setForm({ ...form, email: v })} />
              <Input icon="call" placeholder="Phone" onChangeText={(v) => setForm({ ...form, phone: v })} />

              <TouchableOpacity style={styles.primary} onPress={next}>
                <Text style={styles.primaryText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Input
                icon="lock-closed"
                placeholder="Password"
                secureTextEntry
                onChangeText={(v) => setForm({ ...form, password: v })}
              />

              {/* PASSWORD STRENGTH */}
              <View style={styles.strengthBarBg}>
                <View style={[styles.strengthBar, { width: strength.w, backgroundColor: strength.c }]} />
              </View>
              <Text style={[styles.strengthText, { color: strength.c }]}>
                Password strength: {strength.t}
              </Text>

              {/* GENDER */}
              <Selector
                label="Gender"
                options={["MALE", "FEMALE"]}
                value={form.gender}
                onChange={(v) => setForm({ ...form, gender: v })}
              />

              {/* ROLE */}
              <Selector
                label="Role"
                options={["STUDENT", "OWNER"]}
                value={form.role}
                onChange={(v) => setForm({ ...form, role: v })}
              />

              <TouchableOpacity style={styles.primary} onPress={next}>
                <Text style={styles.primaryText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <Input icon="location" placeholder="Address" onChangeText={(v) => setForm({ ...form, address: v })} />

              {form.role === "STUDENT" && (
                <Input icon="school" placeholder="University" onChangeText={(v) => setForm({ ...form, studentUniversity: v })} />
              )}

              {form.role === "OWNER" && (
                <>
                  <Input icon="id-card" placeholder="NIC Number" onChangeText={(v) => setForm({ ...form, nicNumber: v })} />
                  <Input icon="wallet" placeholder="Bank Account No" onChangeText={(v) => setForm({ ...form, accNo: v })} />
                </>
              )}

              <TouchableOpacity style={styles.primary} onPress={submit}>
                <Text style={styles.primaryText}>Register & Get OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */
const Input = ({ icon, ...props }) => (
  <View style={styles.inputWrap}>
    <Ionicons name={icon} size={18} color="#38bdf8" />
    <TextInput {...props} style={styles.input} placeholderTextColor="#64748b" />
  </View>
);

const Selector = ({ label, options, value, onChange }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectorRow}>
      {options.map((o) => (
        <TouchableOpacity
          key={o}
          onPress={() => onChange(o)}
          style={[styles.selector, value === o && styles.selectorActive]}
        >
          <Text style={styles.selectorText}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 20 },
  logo: { fontSize: 36, fontWeight: "900", color: "#38bdf8", textAlign: "center" },
  subtitle: { color: "#94a3b8", textAlign: "center", marginBottom: 20 },

  progressBg: { height: 6, backgroundColor: "#1e293b", borderRadius: 10, marginBottom: 20 },
  progressFill: { height: 6, backgroundColor: "#38bdf8", borderRadius: 10 },

  card: {
    backgroundColor: "rgba(15,23,42,0.85)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 14,
  },
  input: { flex: 1, color: "white", paddingVertical: 14, marginLeft: 10 },

  label: { color: "#94a3b8", marginBottom: 6 },
  selectorRow: { flexDirection: "row", marginBottom: 14 },
  selector: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginRight: 8,
  },
  selectorActive: { borderColor: "#38bdf8", backgroundColor: "#0f172a" },
  selectorText: { color: "white", textAlign: "center", fontWeight: "600" },

  strengthBarBg: { height: 6, backgroundColor: "#1e293b", borderRadius: 10 },
  strengthBar: { height: 6, borderRadius: 10 },
  strengthText: { marginBottom: 12, marginTop: 6, fontSize: 12 },

  primary: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 16 },
  primaryText: { color: "white", fontWeight: "700", textAlign: "center", fontSize: 16 },
});

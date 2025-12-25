import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../client/api";
import AuthProgress from "../components/AuthProgress";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      Alert.alert("Required", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      router.push({
        pathname: "/verify-otp",
        params: { email, mode: "reset" },
      });
    } catch {
      Alert.alert("Error", "Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <AuthProgress step={1} />

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.sub}>
          We’ll send a verification code to your email
        </Text>

        <View style={styles.inputWrap}>
          <Ionicons name="mail" size={18} color="#94a3b8" />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.primary} onPress={sendOtp}>
          <Text style={styles.primaryText}>
            {loading ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617", justifyContent: "center" },
  card: {
    backgroundColor: "#0f172a",
    margin: 20,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  sub: { color: "#94a3b8", marginBottom: 20 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  input: { flex: 1, color: "white", paddingVertical: 14, marginLeft: 10 },

  primary: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  primaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 14,
  },
});

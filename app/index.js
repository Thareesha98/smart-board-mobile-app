import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../client/api";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Email & Password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });
      const { token, refreshToken, user } = res.data;

      await login(token, refreshToken, user);

      if (user.role === "STUDENT") router.replace("/student/home");
      else if (user.role === "OWNER") router.replace("/owner/home");
      else if (user.role === "ADMIN") router.replace("/admin/home");
      else Alert.alert("Error", "Unknown user role");

    } catch (err) {
      console.log(err);
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo / Title */}
        <Text style={styles.logo}>SMART BOARD</Text>
        <Text style={styles.subtitle}>
          Smart Boarding Management System
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Login to continue</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={doLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? "Signing in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerText}>
              Don’t have an account? <Text style={styles.link}>Register</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#38bdf8",
    textAlign: "center",
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  cardSub: {
    color: "#94a3b8",
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: "white",
    paddingVertical: 14,
    marginLeft: 10,
  },

  loginBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  loginText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  registerBtn: {
    marginTop: 18,
    alignItems: "center",
  },
  registerText: {
    color: "#94a3b8",
  },
  link: {
    color: "#38bdf8",
    fontWeight: "700",
  },
  forgot: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 14,
  },
});

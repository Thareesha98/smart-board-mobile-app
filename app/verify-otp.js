import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../client/api";
import { AuthContext } from "../auth/AuthContext";
import AuthProgress from "../components/AuthProgress";

export default function VerifyOtp() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { email, mode } = useLocalSearchParams(); // 👈 MODE IS CRITICAL
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  /* 🔁 Pulse animation */
  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ⏳ Resend timer */
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* ✅ VERIFY OTP (REGISTER / RESET) */
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return Alert.alert("Invalid OTP", "Enter the 6-digit code");
    }

    try {
      setLoading(true);

      // 🔐 PASSWORD RESET FLOW
      if (mode === "reset") {
        router.replace({
          pathname: "/reset-password",
          params: { email, otp },
        });
        return;
      }

      // 🆕 REGISTRATION FLOW
      const res = await api.post("/auth/register/verify", {
        email,
        otp,
      });

      const { token, refreshToken, user } = res.data;
      await login(token, refreshToken, user);

      if (user.role === "STUDENT") router.replace("/student/home");
      else if (user.role === "OWNER") router.replace("/owner/home");
      else router.replace("/admin/home");

    } catch (e) {
      Alert.alert("Invalid OTP", "Please try again");
    } finally {
      setLoading(false);
    }
  };

  /* 🔄 RESEND OTP */
  const resendOtp = async () => {
    try {
      if (mode === "reset") {
        await api.post("/auth/forgot-password", { email });
      } else {
        await api.post("/auth/register/request", { email });
      }
      setTimer(60);
    } catch {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress step={2} />
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.sub}>We sent a code to</Text>
        <Text style={styles.email}>{email}</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TextInput
            style={styles.otp}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={(v) => {
              setOtp(v);
              pulse();
              if (v.length === 6) verifyOtp();
            }}
            placeholder="••••••"
            placeholderTextColor="#64748b"
          />
        </Animated.View>

        <TouchableOpacity
          style={styles.primary}
          onPress={verifyOtp}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </TouchableOpacity>

        {timer > 0 ? (
          <Text style={styles.timer}>Resend in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={resendOtp}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { flex: 1, justifyContent: "center", padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  sub: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  email: {
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 20,
  },

  otp: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    paddingVertical: 18,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 10,
    color: "white",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  primary: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },

  timer: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 14,
  },
  resend: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 14,
    fontWeight: "600",
  },
});

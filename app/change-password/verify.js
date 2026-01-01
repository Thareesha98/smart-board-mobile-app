import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../client/api";
import { AuthContext } from "../../auth/AuthContext";

export default function ChangePasswordVerify() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!otp || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      Alert.alert(
        "Password Changed",
        "Please login again with your new password",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              router.replace("/");
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert("Error", "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Verify OTP</Text>

        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={resetPassword}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Updating..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 20 },

  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },

  label: { color: "#94a3b8", marginBottom: 6 },

  input: {
    backgroundColor: "#020617",
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: "white",
    marginBottom: 16,
  },

  btn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

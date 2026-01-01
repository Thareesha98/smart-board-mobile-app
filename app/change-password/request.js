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
import { useRouter } from "expo-router";
import api from "../../client/api";
import { AuthContext } from "../../auth/AuthContext";

export default function ChangePasswordRequest() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: user.email,
      });

      Alert.alert(
        "OTP Sent",
        "A verification code has been sent to your email"
      );

      router.push({
        pathname: "/change-password/verify",
        params: { email: user.email },
      });
    } catch (e) {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Change Password</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabled]}
          value={user.email}
          editable={false}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={requestOtp}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Sending OTP..." : "Send OTP"}
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
    marginBottom: 20,
  },
  disabled: { opacity: 0.6 },

  btn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

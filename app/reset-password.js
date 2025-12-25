import { useState } from "react";
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
import api from "../client/api";

export default function ResetPassword() {
  const { email, otp } = useLocalSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const reset = async () => {
    if (password.length < 6) {
      return Alert.alert("Weak password");
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      Alert.alert("Success", "Password reset successful");
      router.replace("/");
    } catch {
      Alert.alert("Error", "Failed to reset password");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Set New Password</Text>

        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.primary} onPress={reset}>
          <Text style={styles.primaryText}>Reset Password</Text>
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
  title: { color: "white", fontSize: 22, marginBottom: 14 },
  input: {
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 14,
    color: "white",
    marginBottom: 14,
  },
  primary: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});

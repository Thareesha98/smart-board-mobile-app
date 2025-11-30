import { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../client/api";
import { AuthContext } from "../auth/AuthContext";

export default function RegisterVerify() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const verifyOtp = async () => {
    try {
      const res = await api.post("/auth/register/verify", {
        email,
        otp
      });

      const { token, refreshToken, user } = res.data;

      await login(token, refreshToken, user);

      if (user.role === "STUDENT") router.replace("/student/home");
      if (user.role === "OWNER") router.replace("/owner/home");

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP sent to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
      />

      <Button title="Verify" onPress={verifyOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:20, marginBottom:20 },
  input: {
    borderWidth:1, borderColor:"#ccc",
    padding:10, marginBottom:10, borderRadius:8
  }
});

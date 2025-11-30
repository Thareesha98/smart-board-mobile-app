import { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../client/api"
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email & Password required");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, refreshToken, user } = res.data;

      await login(token, refreshToken, user);

      // redirect based on backend role
      if (user.role === "STUDENT") router.replace("/student/home");
      else if (user.role === "OWNER") router.replace("/owner/home");
      else if (user.role === "ADMIN") router.replace("/admin/home");
      else Alert.alert("Error", "Unknown user role");

    } catch (err) {
      console.log(err);
      Alert.alert("Login Failed", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SBMS Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={doLogin} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:26, fontWeight:"bold", textAlign:"center", marginBottom:20 },
  input: {
    borderWidth:1, borderColor:"#ccc", padding:10,
    borderRadius:8, marginBottom:10
  }
});

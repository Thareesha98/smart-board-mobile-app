import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from "react-native";
import api from "../client/api";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "MALE",
    role: "STUDENT",

    // owner
    nicNumber: "",
    accNo: "",

    // student
    studentUniversity: ""
  });

  const update = (field, value) =>
    setForm({ ...form, [field]: value });

  const requestOtp = async () => {
    try {
      await api.post("/auth/register/request", form);
      Alert.alert("OTP Sent", "Check your email for the code.");

      router.push({
        pathname: "/registerVerify",
        params: { email: form.email }
      });

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Registration failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Full Name"
        value={form.fullName} onChangeText={(v)=>update("fullName",v)} />

      <TextInput style={styles.input} placeholder="Email"
        value={form.email} onChangeText={(v)=>update("email",v)} />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry
        value={form.password} onChangeText={(v)=>update("password",v)} />

      <TextInput style={styles.input} placeholder="Phone"
        value={form.phone} onChangeText={(v)=>update("phone",v)} />

      <TextInput style={styles.input} placeholder="Address"
        value={form.address} onChangeText={(v)=>update("address",v)} />

      <Button title="Register" onPress={requestOtp} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding:15 },
  title: { fontSize:22, fontWeight:"bold", marginBottom:20 },
  input: {
    borderWidth:1, borderColor:"#ccc", marginBottom:10,
    padding:10, borderRadius:8
  }
});

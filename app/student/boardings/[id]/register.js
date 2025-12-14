import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../../client/api";
import { AuthContext } from "../../../../auth/AuthContext";

export default function RegisterBoarding() {
  const { id } = useLocalSearchParams(); // boardingId
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const studentId = user?.id;

  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);

  const [numberOfStudents, setNumberOfStudents] = useState("1");
  const [studentNote, setStudentNote] = useState("");

  const [keyMoneyPaid, setKeyMoneyPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load boarding detail for keyMoney + available slots + monthly price
  useEffect(() => { loadBoarding(); }, []);

  const loadBoarding = async () => {
    try {
      const res = await api.get(`/boardings/${id}`);
      setBoarding(res.data);
    } catch (e) {
      console.log("❌ Error loading boarding:", e);
    } finally {
      setLoading(false);
    }
  };

  const processDummyPayment = async () => {
    setPaymentProcessing(true);

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Always successful (dummy gateway)
    setKeyMoneyPaid(true);
    setPaymentProcessing(false);

    Alert.alert("Payment Successful", "Key money has been paid.");
  };

  const submitRegistration = async () => {
    if (!keyMoneyPaid) {
      Alert.alert("Payment Required", "You must pay the key money first.");
      return;
    }

    if (!numberOfStudents || Number(numberOfStudents) < 1) {
      Alert.alert("Error", "Please enter valid number of students.");
      return;
    }

    try {
      const payload = {
        boardingId: Number(id),
        numberOfStudents: Number(numberOfStudents),
        studentNote,
        keyMoneyPaid: true,
      };

      const res = await api.post(
        `/registrations/student/${studentId}`,
        payload
      );

      Alert.alert("Success", "Registration submitted!", [
        { text: "OK", onPress: () => router.replace("/student/registrations") },
      ]);
    } catch (error) {
      console.log("❌ Registration error:", error);
      Alert.alert("Error", error?.response?.data || "Registration failed.");
    }
  };

  if (loading || !boarding) {
    return (
      <SafeAreaView style={styles.loader}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.header}>Register for Boarding</Text>

        {/* Boarding Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.title}>{boarding.title}</Text>
          <Text style={styles.address}>{boarding.address}</Text>
          <Text style={styles.price}>Monthly: Rs {boarding.pricePerMonth}</Text>
          <Text style={styles.keyMoney}>Key Money: Rs {boarding.keyMoney}</Text>
        </View>

        {/* Number of students */}
        <Text style={styles.label}>Number of Students</Text>
        <TextInput
          style={styles.input}
          value={numberOfStudents}
          onChangeText={setNumberOfStudents}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor="#64748b"
        />

        {/* Student Note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={studentNote}
          onChangeText={setStudentNote}
          multiline
          placeholder="Any note for the owner..."
          placeholderTextColor="#64748b"
        />

        {/* Payment Section */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Key Money Payment</Text>
          <Text style={styles.paymentAmount}>
            Amount: Rs {boarding.keyMoney}
          </Text>

          {keyMoneyPaid ? (
            <View style={styles.paidTag}>
              <Text style={styles.paidText}>✔ Key Money Paid</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.payButton}
              onPress={processDummyPayment}
              disabled={paymentProcessing}
            >
              <Text style={styles.payButtonText}>
                {paymentProcessing ? "Processing..." : "Pay Now"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={submitRegistration}
        >
          <Text style={styles.submitText}>Submit Registration</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { padding: 20, paddingBottom: 60 },
  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  summaryCard: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  title: { color: "white", fontSize: 18, fontWeight: "700" },
  address: { color: "#94a3b8", marginTop: 4 },
  price: { color: "#22c55e", marginTop: 10, fontWeight: "700" },
  keyMoney: { color: "#38bdf8", marginTop: 4 },

  label: { color: "#cbd5e1", marginTop: 16, marginBottom: 4 },
  input: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  textArea: { height: 100, textAlignVertical: "top" },

  paymentBox: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginTop: 25,
  },
  paymentTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  paymentAmount: { color: "#38bdf8", marginTop: 4 },

  payButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
  },
  payButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  paidTag: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    alignItems: "center",
  },
  paidText: { color: "white", fontWeight: "700" },

  submitBtn: {
    marginTop: 30,
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 12,
  },
  submitText: { textAlign: "center", color: "white", fontWeight: "700" },

  cancelBtn: { marginTop: 14, padding: 12 },
  cancelText: { color: "#ef4444", textAlign: "center", fontSize: 16 },
});

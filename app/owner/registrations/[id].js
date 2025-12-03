import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import api from "../../../client/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "../../../auth/AuthContext";

export default function OwnerRegistrationDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;
  const router = useRouter();

  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(true);

  // decision state
  const [ownerNote, setOwnerNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      // No single registration GET given — fetch owner list and find item (or your backend may provide GET /registrations/{id})
      const res = await api.get(`/registrations/owner/${ownerId}`);
      const found = res.data.find((x) => String(x.id) === String(id));
      setReg(found);
    } catch (err) {
      console.log("❌ load reg detail", err);
      Alert.alert("Error", "Could not load registration.");
    } finally { setLoading(false); }
  };

  const submitDecision = async (status) => {
    if (!status) return;
    if (processing) return;

    if (status === "APPROVED") {
      // warn owner
      const ok = await new Promise((resolve) =>
        Alert.alert(
          "Approve Registration",
          "Approving will decrease available slots. Continue?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "Approve", onPress: () => resolve(true) },
          ]
        )
      );
      if (!ok) return;
    }

    try {
      setProcessing(true);
      const payload = {
        status,
        ownerNote,
      };

      await api.put(`/registrations/owner/${ownerId}/${id}`, payload);

      Alert.alert("Success", `Registration ${status.toLowerCase()}.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.log("❌ decision error", err);
      Alert.alert("Error", "Could not submit decision.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!reg) {
    return (
      <SafeAreaView style={styles.loader}>
        <Text style={{ color: "white" }}>Registration not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{reg.boardingTitle}</Text>
        <Text style={styles.sub}>{reg.boardingAddress}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Student</Text>
          <Text style={styles.value}>{reg.studentName} ({reg.studentEmail})</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Number of Students</Text>
          <Text style={styles.value}>{reg.numberOfStudents}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Key Money</Text>
          <Text style={styles.value}>Rs {reg.keyMoney}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Student Note</Text>
          <Text style={styles.value}>{reg.studentNote || "—"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Owner Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={ownerNote}
            onChangeText={setOwnerNote}
            placeholder="Write a note for the student..."
            placeholderTextColor="#64748b"
            multiline
          />
        </View>

        {reg.status === "PENDING" && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.approveBtn, processing && { opacity: 0.6 }]}
              onPress={() => submitDecision("APPROVED")}
              disabled={processing}
            >
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.declineBtn, processing && { opacity: 0.6 }]}
              onPress={() => submitDecision("DECLINED")}
              disabled={processing}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" },
  container: { padding: 16, paddingBottom: 40 },
  header: { color: "white", fontSize: 22, fontWeight: "700" },
  sub: { color: "#94a3b8", marginTop: 4 },

  section: { marginTop: 14 },
  label: { color: "#cbd5e1", fontSize: 13 },
  value: { color: "white", marginTop: 6 },

  input: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#334155",
    marginTop: 8,
    minHeight: 80,
  },

  actionRow: { flexDirection: "row", marginTop: 20, gap: 12 },
  approveBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  approveText: { color: "black", fontWeight: "700" },

  declineBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  declineText: { color: "white", fontWeight: "700" },

  backBtn: { marginTop: 18, padding: 12 },
  backText: { color: "#94a3b8" },
});

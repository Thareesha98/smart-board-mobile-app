import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useRouter } from "expo-router";

export default function StudentRegistrations() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const studentId = user?.id;

  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegs();
  }, []);

  const loadRegs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/registrations/student/${studentId}`);
      setRegs(res.data);
    } catch (err) {
      console.log("❌ load regs", err);
      Alert.alert("Error", "Could not load registrations.");
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (regId) => {
    Alert.alert(
      "Cancel Registration",
      "Are you sure you want to cancel this registration?",
      [
        { text: "No" },
        {
          text: "Yes, cancel",
          onPress: async () => {
            try {
              await api.put(`/registrations/student/${studentId}/${regId}/cancel`);
              Alert.alert("Cancelled", "Registration cancelled.");
              loadRegs();
            } catch (err) {
              console.log("❌ cancel reg", err);
              Alert.alert("Error", "Unable to cancel registration.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Registrations</Text>

        {regs.length === 0 ? (
          <Text style={styles.noData}>You have no registrations.</Text>
        ) : (
          regs.map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{r.boardingTitle}</Text>
                  <Text style={styles.sub}>{r.boardingId ? r.boardingId : ""} • {r.studentName}</Text>
                </View>
                <View style={styles.badgeContainer}>
                  <Text style={[styles.badgeText, statusColor(r.status)]}>{r.status}</Text>
                </View>
              </View>

              <Text style={styles.info}>Students: {r.numberOfStudents}</Text>
              <Text style={styles.info}>Key money: Rs {r.keyMoney}</Text>
              <Text style={styles.noteLabel}>Your note</Text>
              <Text style={styles.noteText}>{r.studentNote || "—"}</Text>
              {r.ownerNote ? (
                <>
                  <Text style={styles.noteLabel}>Owner note</Text>
                  <Text style={styles.noteText}>{r.ownerNote}</Text>
                </>
              ) : null}

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => router.push(`/student/my-boarding/${r.id}`)}
                >
                  <Text style={styles.viewBtnText}>View Boarding</Text>
                </TouchableOpacity>

                {r.status === "PENDING" && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => cancelRegistration(r.id)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function statusColor(status) {
  if (status === "PENDING") return { backgroundColor: "#facc15", color: "black" };
  if (status === "APPROVED") return { backgroundColor: "#22c55e", color: "black" };
  if (status === "DECLINED" || status === "CANCELLED") return { backgroundColor: "#ef4444", color: "white" };
  return { backgroundColor: "#64748b", color: "white" };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" },
  container: { padding: 16, paddingBottom: 40 },
  header: { color: "white", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  noData: { color: "#94a3b8", textAlign: "center", marginTop: 20 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { color: "white", fontSize: 16, fontWeight: "700" },
  sub: { color: "#94a3b8", marginTop: 4 },

  badgeContainer: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  info: { color: "#cbd5e1", marginTop: 8 },
  noteLabel: { color: "#94a3b8", marginTop: 8, fontSize: 12 },
  noteText: { color: "#e2e8f0", marginTop: 4 },

  actionsRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  viewBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  viewBtnText: { color: "white", fontWeight: "700" },

  cancelBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  cancelBtnText: { color: "white", fontWeight: "700" },
});

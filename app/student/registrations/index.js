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
import { Ionicons } from "@expo/vector-icons";
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

  const cancelRegistration = (regId) => {
    Alert.alert(
      "Cancel Registration",
      "Are you sure you want to cancel this registration?",
      [
        { text: "No" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await api.put(
                `/registrations/student/${studentId}/${regId}/cancel`
              );
              loadRegs();
            } catch (err) {
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
        <ActivityIndicator size="large" color="#38bdf8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Boardings</Text>
        <Text style={styles.subHeader}>
          Active & past boarding registrations
        </Text>

        {regs.length === 0 ? (
          <Text style={styles.noData}>No registrations found.</Text>
        ) : (
          regs.map((r) => (
            <View key={r.id} style={styles.card}>
              {/* STATUS BADGE */}
              <View style={[styles.statusBadge, statusStyle(r.status)]}>
                <Text style={styles.statusText}>{r.status}</Text>
              </View>

              {/* TITLE */}
              <Text style={styles.title}>{r.boardingTitle}</Text>

              {/* INFO */}
              <View style={styles.metaRow}>
                <Ionicons name="people-outline" size={16} color="#94a3b8" />
                <Text style={styles.metaText}>
                  {r.numberOfStudents} student(s)
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="cash-outline" size={16} color="#94a3b8" />
                <Text style={styles.metaText}>
                  Key Money: Rs. {r.keyMoney}
                </Text>
              </View>

              {/* NOTES */}
              {r.studentNote ? (
                <Text style={styles.note}>📝 {r.studentNote}</Text>
              ) : null}

              {r.ownerNote ? (
                <Text style={styles.ownerNote}>🏠 {r.ownerNote}</Text>
              ) : null}

              {/* ACTIONS */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() =>
                    router.push(
                      `/student/registrations/${r.id}/dashboard`
                    )
                  }
                >
                  <Ionicons
                    name="speedometer-outline"
                    size={18}
                    color="white"
                  />
                  <Text style={styles.primaryText}>Open Dashboard</Text>
                </TouchableOpacity>

                {r.status === "PENDING" && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => cancelRegistration(r.id)}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color="white"
                    />
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

/* ---------------- STATUS STYLES ---------------- */

function statusStyle(status) {
  switch (status) {
    case "APPROVED":
      return { backgroundColor: "#22c55e" };
    case "PENDING":
      return { backgroundColor: "#facc15" };
    case "DECLINED":
    case "CANCELLED":
      return { backgroundColor: "#ef4444" };
    default:
      return { backgroundColor: "#64748b" };
  }
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 50 },

  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
  },
  subHeader: {
    color: "#94a3b8",
    marginBottom: 20,
  },

  noData: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "black",
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaText: {
    color: "#cbd5e1",
    marginLeft: 6,
  },

  note: {
    color: "#e2e8f0",
    marginTop: 8,
  },
  ownerNote: {
    color: "#94a3b8",
    marginTop: 4,
    fontStyle: "italic",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  primaryText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 6,
  },

  cancelBtn: {
    marginLeft: 10,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
  },
});

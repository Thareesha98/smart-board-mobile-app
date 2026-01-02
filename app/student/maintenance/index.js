import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useRouter } from "expo-router";


export default function MaintenanceIndex() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/maintenance/student");
      setItems(res.data);
    } catch (e) {
      console.log("❌ maintenance error", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SAFE NAVIGATION ---------------- */
  const goToCreate = () => {
    /**
     * We MUST have a boardingId.
     * Maintenance is always created for a boarding.
     *
     * If your app allows multiple registered boardings,
     * you can later show a selector.
     *
     * For now, we safely take the first one.
     */
    if (!items.length || !items[0]?.boardingId) {
      Alert.alert(
        "No Boarding",
        "You must have a registered boarding to request maintenance"
      );
      return;
    }

    router.push({
      pathname: "/student/maintenance/create",
      params: {
        boardingId: String(items[0].boardingId), // 🔥 REQUIRED
      },
    });
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
        <Text style={styles.header}>Maintenance</Text>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="build-outline" size={48} color="#64748b" />
            <Text style={styles.emptyText}>
              No maintenance requests yet
            </Text>
          </View>
        ) : (
          items.map(m => (
           <TouchableOpacity
            key={m.id}
            activeOpacity={0.85}
            onPress={() =>
            router.push({
                pathname: "/student/maintenance/[id]",
                params: { id: String(m.id) },
            })
            }
        >
            <View key={m.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.title}>{m.title}</Text>
                <Status status={m.status } />
              </View>

              <Text style={styles.desc}>{m.description}</Text>

              {m.ownerNote && (
                <View style={styles.ownerBox}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color="#38bdf8"
                  />
                  <Text style={styles.ownerText}>{m.ownerNote}</Text>
                </View>
              )}
            </View>
        </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={goToCreate}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function Status({ status }) {
  const map = {
    PENDING: "#facc15",
    IN_PROGRESS: "#38bdf8",
    COMPLETED: "#22c55e",
    REJECTED: "#ef4444",
  };

  return (
    <View style={[styles.badge, { backgroundColor: map[status] || "#64748b" }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 120 },
  header: { color: "white", fontSize: 26, fontWeight: "800", marginBottom: 16 },

  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: "white", fontSize: 16, fontWeight: "700" },
  desc: { color: "#cbd5e1", marginTop: 6 },

  ownerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#020617",
    padding: 8,
    borderRadius: 10,
  },
  ownerText: { color: "#94a3b8", marginLeft: 6 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontWeight: "700", color: "black" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});

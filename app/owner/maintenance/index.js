import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../client/api";

/* ========================================================= */
export default function OwnerMaintenanceDashboard() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/maintenance/owner");
      setItems(res.data || []);
    } catch (e) {
      console.log("❌ maintenance load error", e?.response?.data || e);
      Alert.alert("Error", "Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STATS ---------------- */
  const stats = {
    PENDING: items.filter(i => i.status === "PENDING").length,
    IN_PROGRESS: items.filter(i => i.status === "IN_PROGRESS").length,
    COMPLETED: items.filter(i => i.status === "COMPLETED").length,
  };

  const total = stats.PENDING + stats.IN_PROGRESS + stats.COMPLETED || 1;

  const filtered = items.filter(i => i.status === tab);

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#fb923c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <Text style={styles.header}>Maintenance Dashboard</Text>
        <Text style={styles.sub}>Track & resolve student issues</Text>

        {/* STATS */}
        <View style={styles.statsRow}>
          <StatBox label="Open" value={stats.PENDING} color="#ef4444" />
          <StatBox label="In Progress" value={stats.IN_PROGRESS} color="#facc15" />
          <StatBox label="Completed" value={stats.COMPLETED} color="#22c55e" />
        </View>

        {/* ANALYTICS */}
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>Maintenance Load</Text>

          <View style={styles.barTrack}>
            <View style={[styles.barSegment, { flex: stats.PENDING, backgroundColor: "#ef4444" }]} />
            <View style={[styles.barSegment, { flex: stats.IN_PROGRESS, backgroundColor: "#facc15" }]} />
            <View style={[styles.barSegment, { flex: stats.COMPLETED, backgroundColor: "#22c55e" }]} />
          </View>

          <View style={styles.legendRow}>
            <Legend color="#ef4444" label={`Open (${stats.PENDING})`} />
            <Legend color="#facc15" label={`In Progress (${stats.IN_PROGRESS})`} />
            <Legend color="#22c55e" label={`Completed (${stats.COMPLETED})`} />
          </View>

          {stats.PENDING > stats.COMPLETED ? (
            <Text style={styles.alertText}>
              ⚠️ High number of unresolved maintenance requests
            </Text>
          ) : (
            <Text style={styles.successText}>
              ✅ Maintenance handling is healthy
            </Text>
          )}
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          <Tab label="OPEN" value="PENDING" tab={tab} setTab={setTab} />
          <Tab label="IN PROGRESS" value="IN_PROGRESS" tab={tab} setTab={setTab} />
          <Tab label="COMPLETED" value="COMPLETED" tab={tab} setTab={setTab} />
        </View>

        {/* LIST */}
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No issues in this category.</Text>
        ) : (
          filtered.map(item => (
            <MaintenanceCard key={item.id} item={item} reload={load} />
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, value, tab, setTab }) {
  const active = tab === value;
  return (
    <TouchableOpacity
      onPress={() => setTab(value)}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MaintenanceCard({ item, reload }) {
  const updateStatus = (status) => {
    Alert.alert(
      "Confirm Action",
      `Change status to ${status}?`,
      [
        { text: "Cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await api.put(`/maintenance/owner/${item.id}`, {
                status,
                ownerNote: `Updated to ${status}`,
              });
              Alert.alert("Success", "Status updated");
              reload();
            } catch (e) {
              console.log(e?.response?.data || e);
              Alert.alert("Error", "Unable to update status");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.cardSub}>
        {item.boardingTitle} • {item.studentName}
      </Text>

      <Text style={styles.desc}>{item.description}</Text>

      {item.imageUrls?.length > 0 && (
        <ScrollView horizontal>
          {item.imageUrls.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      {item.status !== "COMPLETED" && (
        <View style={styles.actionRow}>
          {item.status === "PENDING" && (
            <ActionBtn
              label="Start Work"
              color="#facc15"
              onPress={() => updateStatus("IN_PROGRESS")}
            />
          )}

          <ActionBtn
            label="Complete"
            color="#22c55e"
            onPress={() => updateStatus("COMPLETED")}
          />

          <ActionBtn
            label="Reject"
            color="#ef4444"
            onPress={() => updateStatus("REJECTED")}
          />
        </View>
      )}
    </View>
  );
}

function ActionBtn({ label, color, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionBtn, { backgroundColor: color }]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legend}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "#ef4444",
    IN_PROGRESS: "#facc15",
    COMPLETED: "#22c55e",
    REJECTED: "#64748b",
  };

  return (
    <View style={[styles.badge, { backgroundColor: map[status] }]}>
      <Text style={styles.badgeText}>
        {status === "PENDING" ? "OPEN" : status}
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 18 },

  header: { color: "white", fontSize: 28, fontWeight: "800" },
  sub: { color: "#94a3b8", marginBottom: 20 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  statBox: {
    width: "32%",
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { color: "#94a3b8", marginTop: 4 },

  analyticsCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  analyticsTitle: { color: "white", fontWeight: "800", marginBottom: 10 },
  barTrack: { flexDirection: "row", height: 12, borderRadius: 999, overflow: "hidden" },
  barSegment: { height: "100%" },

  legendRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  legend: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: "#94a3b8", fontSize: 12 },

  alertText: { color: "#f87171", marginTop: 10 },
  successText: { color: "#22c55e", marginTop: 10 },

  tabs: { flexDirection: "row", marginBottom: 14 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, marginRight: 10, borderRadius: 999, backgroundColor: "#020617" },
  tabActive: { backgroundColor: "#fb923c" },
  tabText: { color: "#94a3b8", fontWeight: "700" },
  tabTextActive: { color: "black" },

  empty: { color: "#94a3b8", textAlign: "center", marginTop: 40 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { color: "white", fontWeight: "800" },
  cardSub: { color: "#94a3b8" },
  desc: { color: "#e2e8f0", marginTop: 8 },

  image: { width: 90, height: 90, borderRadius: 12, marginRight: 8, marginTop: 10 },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontWeight: "800", fontSize: 11, color: "black" },

  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  actionText: { color: "black", fontWeight: "800", fontSize: 12 },
});

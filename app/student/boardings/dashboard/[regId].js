import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../../client/api";
import { AuthContext } from "../../../../auth/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function StudentBoardingDashboard() {
  const { regId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get(`/registrations/${regId}/dashboard`);
      setData(res.data);
    } catch (e) {
      console.log("❌ dashboard load error", e);
    } finally {
      setLoading(false);
    }
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
        {/* HEADER */}
        <Text style={styles.header}>{data.boardingTitle}</Text>
        <Text style={styles.sub}>
          Status: <Text style={styles.status}>{data.registrationStatus}</Text>
        </Text>

        {/* QUICK STATS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StatCard
            icon="cash-outline"
            title="This Month Due"
            value={`Rs. ${data.currentMonthDue}`}
            sub={`Due in ${data.daysUntilDue} days`}
            color="#facc15"
          />
          <StatCard
            icon="construct-outline"
            title="Maintenance"
            value={`${data.openMaintenance} Open`}
            sub={`${data.fixedMaintenance} Fixed`}
            color="#38bdf8"
          />
          <StatCard
            icon="star-outline"
            title="Rating"
            value={`${data.rating || "—"}`}
            sub="Avg rating"
            color="#22c55e"
          />
        </ScrollView>

        {/* ACTIONS */}
        <Text style={styles.section}>Actions</Text>

        <View style={styles.actionGrid}>
          <ActionCard
            icon={<Ionicons name="card-outline" size={26} color="#38bdf8" />}
            title="Payments & Bills"
            onPress={() => router.push(`/student/payments/${regId}`)}
          />
          <ActionCard
            icon={<MaterialIcons name="build" size={26} color="#facc15" />}
            title="Maintenance"
            onPress={() => router.push("/student/maintenance")}
          />
          <ActionCard
            icon={<Ionicons name="document-text-outline" size={26} color="#22c55e" />}
            title="Rules"
            onPress={() => router.push(`/student/rules/${regId}`)}
          />
          <ActionCard
            icon={<Ionicons name="star-outline" size={26} color="#f97316" />}
            title="Reviews"
            onPress={() => router.push(`/student/reviews/${regId}`)}
          />
          <ActionCard
            icon={<Ionicons name="call-outline" size={26} color="#38bdf8" />}
            title="Contact Owner"
            onPress={() => router.push(`/student/contact/${regId}`)}
          />
          <ActionCard
            icon={<Ionicons name="alert-circle-outline" size={26} color="#ef4444" />}
            title="Report Issue"
            onPress={() => router.push(`/student/report/${regId}`)}
          />
        </View>

        {/* TIMELINE */}
        <Text style={styles.section}>Timeline</Text>

        <TimelineItem label="Registered" value={format(data.registeredAt)} />
        <TimelineItem label="Last Payment" value={format(data.lastPaymentDate)} />
        <TimelineItem label="Last Maintenance" value={format(data.lastMaintenanceDate)} />
        <TimelineItem label="Next Bill" value={format(data.nextBillDate)} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, title, value, sub, color }) {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function ActionCard({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      {icon}
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function TimelineItem({ label, value }) {
  return (
    <View style={styles.timelineItem}>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={styles.timelineValue}>{value || "—"}</Text>
    </View>
  );
}

function format(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString();
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 40 },

  header: { color: "white", fontSize: 24, fontWeight: "700" },
  sub: { color: "#94a3b8", marginBottom: 14 },
  status: { color: "#22c55e", fontWeight: "700" },

  section: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 14,
  },

  statCard: {
    width: 160,
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
  },
  statValue: { color: "white", fontSize: 16, fontWeight: "700", marginTop: 6 },
  statTitle: { color: "#cbd5e1", marginTop: 4 },
  statSub: { color: "#94a3b8", fontSize: 12 },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionText: {
    color: "#f8fafc",
    fontWeight: "600",
    marginTop: 8,
  },

  timelineItem: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  timelineLabel: { color: "#94a3b8", fontSize: 12 },
  timelineValue: { color: "white", fontWeight: "600" },
});

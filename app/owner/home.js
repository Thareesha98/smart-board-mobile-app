import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../../auth/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import useNotifications from "../../hooks/useNotifications";
import useUnreadNotifications from "../../hooks/useUnreadNotifications";

export default function OwnerHome() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useNotifications();
  const unread = useUnreadNotifications();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.header}>Owner Dashboard</Text>
            <Text style={styles.sub}>
              Welcome back, {user?.fullName || user?.email}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notifIcon}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={26} color="white" />
            {unread > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

       {/* INSIGHTS */}
        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="home-outline"
            label="Active Ads"
            value="12"
            accent="#38bdf8"
          />
          <StatCard
            icon="event-available"
            label="Appointments"
            value="5"
            accent="#22c55e"
          />
          <StatCard
            icon="user-check"
            label="Registrations"
            value="3"
            accent="#facc15"
          />
          <StatCard
            icon="alert-circle-outline"
            label="Pending Bills"
            value="2"
            accent="#ef4444"
          />

  {/* 🔧 MAINTENANCE INSIGHT (NEW) */}
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.statCard, styles.maintenanceCard]}
    onPress={() => router.push("/owner/maintenance")}
  >
    <Ionicons name="build-outline" size={26} color="#fb923c" />
    <Text style={styles.statValue}>4</Text>
    <Text style={styles.statLabel}>Maintenance Requests</Text>
    <Text style={styles.maintenanceHint}>Tap to manage</Text>
  </TouchableOpacity>
</View>


        {/* REVENUE SNAPSHOT */}
        <Text style={styles.sectionTitle}>Revenue Snapshot</Text>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Last 4 Months</Text>

          <View style={styles.barRow}>
            <Bar label="Jun" value={0.6} />
            <Bar label="Jul" value={0.8} />
            <Bar label="Aug" value={0.4} />
            <Bar label="Sep" value={0.9} />
          </View>

          <Text style={styles.chartHint}>
            * Monthly income trend (mock)
          </Text>
        </View>

        {/* HEALTH */}
        <Text style={styles.sectionTitle}>System Health</Text>

        <View style={styles.healthCard}>
          <HealthRow
            label="Occupancy"
            value="82%"
            color="#22c55e"
          />
          <HealthRow
            label="Maintenance Resolved"
            value="90%"
            color="#38bdf8"
          />
          <HealthRow
            label="Payment Success"
            value="96%"
            color="#facc15"
          />
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <ActionCard
            title="Create Ad"
            icon="add-circle-outline"
            onPress={() => router.push("/owner/ads/create")}
          />
          <ActionCard
            title="My Ads"
            icon="home-work"
            onPress={() => router.push("/owner/ads")}
          />
          <ActionCard
            title="Appointments"
            icon="event-note"
            onPress={() => router.push("/owner/appointments")}
          />
          <ActionCard
            title="Registrations"
            icon="clipboard-check"
            onPress={() => router.push("/owner/registrations")}
          />
          <ActionCard
            title="Utilities"
            icon="water"
            onPress={() => router.push("/owner/utilities")}
          />
          <ActionCard
            title="Reports"
            icon="warning-outline"
            danger
            onPress={() => router.push("/owner/reports")}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, label, value, accent }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={26} color={accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ title, icon, onPress, danger }) {
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        danger && { borderColor: "#ef4444" },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons
        name={icon}
        size={26}
        color={danger ? "#ef4444" : "#38bdf8"}
      />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Bar({ label, value }) {
  return (
    <View style={styles.barItem}>
      <View style={[styles.bar, { height: `${value * 100}%` }]} />
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

function HealthRow({ label, value, color }) {
  return (
    <View style={styles.healthRow}>
      <Text style={styles.healthLabel}>{label}</Text>
      <Text style={[styles.healthValue, { color }]}>{value}</Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 18, paddingBottom: 60 },

  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: { color: "white", fontSize: 28, fontWeight: "800" },
  sub: { color: "#94a3b8", marginTop: 2 },

  notifIcon: { position: "relative" },
  notifBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notifBadgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 11,
  },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  statLabel: { color: "#94a3b8", marginTop: 4 },

  chartCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  chartTitle: { color: "white", fontWeight: "700", marginBottom: 12 },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 120,
    marginBottom: 8,
  },
  barItem: { alignItems: "center", width: "22%" },
  bar: {
    width: "100%",
    backgroundColor: "#38bdf8",
    borderRadius: 8,
  },
  barLabel: { color: "#94a3b8", marginTop: 6, fontSize: 12 },
  chartHint: { color: "#64748b", fontSize: 11 },

  healthCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  healthLabel: { color: "#94a3b8" },
  healthValue: { fontWeight: "800" },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionText: {
    color: "white",
    marginTop: 10,
    fontWeight: "700",
  },

  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 14,
  },
  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
});

import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from "react-native";
import { AuthContext } from "../../auth/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function OwnerHome() {
  const { user , logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/"); 
        },
      },
    ]
  );
};


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
        </View>

        {/* INSIGHTS */}
        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.statsGrid}>

          {/* Active Ads */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.statCard}
            onPress={() => router.push("/owner/ads")}
          >
            <Ionicons name="home-outline" size={26} color="#38bdf8" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Active Ads</Text>
          </TouchableOpacity>

          {/* Appointments */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.statCard}
            onPress={() => router.push("/owner/appointments")}
          >
            <Ionicons name="event-available" size={26} color="#22c55e" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </TouchableOpacity>

          {/* Registrations */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.statCard}
            onPress={() => router.push("/owner/registrations")}
          >
            <Ionicons name="user-check" size={26} color="#facc15" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Registrations</Text>
          </TouchableOpacity>

          {/* Pending Bills */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.statCard}
            onPress={() => router.push("/owner/utilities")}
          >
            <Ionicons name="alert-circle-outline" size={26} color="#ef4444" />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending Bills</Text>
          </TouchableOpacity>

          {/* Maintenance */}
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

          {/* Chats */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.statCard , styles.chatCard]}
            onPress={() => router.push("/chat")}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={26} color="#38bdf8" />
            <Text style={styles.statValue}>Chats</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </TouchableOpacity>


        </View>



        {/* REVENUE */}
        <Text style={styles.sectionTitle}>Revenue Snapshot</Text>
        <View style={styles.chartCard}>
          <View style={styles.barRow}>
            <Bar label="Jun" value={0.6} />
            <Bar label="Jul" value={0.8} />
            <Bar label="Aug" value={0.4} />
            <Bar label="Sep" value={0.9} />
          </View>
          <Text style={styles.chartHint}>* Monthly income trend</Text>
        </View>

        {/* HEALTH */}
        <Text style={styles.sectionTitle}>System Health</Text>
        <View style={styles.healthCard}>
          <HealthRow label="Occupancy" value="82%" color="#22c55e" />
          <HealthRow label="Maintenance Resolved" value="90%" color="#38bdf8" />
          <HealthRow label="Payment Success" value="96%" color="#facc15" />
        </View>
      </ScrollView>
      {/* LOGOUT */}
<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
  <Ionicons name="log-out-outline" size={18} color="white" />
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function StatCard({ icon, label, value, accent }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={26} color={accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    padding: 18,
    paddingBottom: 100, // space for bottom tabs
  },

  headerBox: {
    marginBottom: 12,
  },

  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  sub: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 14,
  },

  sectionTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 16,
  },

  /* ---------- STATS ---------- */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
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

  statLabel: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 13,
    textAlign: "center",
  },

  maintenanceHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#fb923c",
  },

  chatCard: {
  borderColor: "#38bdf8",
  borderWidth: 1.5,
},


  /* ---------- REVENUE ---------- */

  chartCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 130,
  },

  barItem: {
    alignItems: "center",
    width: "22%",
  },

  bar: {
    width: "100%",
    backgroundColor: "#38bdf8",
    borderRadius: 10,
  },

  barLabel: {
    color: "#94a3b8",
    marginTop: 8,
    fontSize: 12,
  },

  chartHint: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 10,
    textAlign: "center",
  },

  /* ---------- HEALTH ---------- */

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
    marginBottom: 10,
  },

  healthLabel: {
    color: "#94a3b8",
    fontSize: 14,
  },

  healthValue: {
    fontWeight: "800",
    fontSize: 15,
  },

  logoutBtn: {
  marginTop: 30,
  backgroundColor: "#ef4444",
  paddingVertical: 14,
  borderRadius: 16,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
},

logoutText: {
  color: "white",
  fontWeight: "800",
  fontSize: 16,
},

});

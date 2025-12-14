import React, { useContext } from "react";
import useNotifications from "../../hooks/useNotifications";
import useUnreadNotifications from "../../hooks/useUnreadNotifications";
import { triggerLocalNotification } from "../../hooks/useNotifications";

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

export default function OwnerHome() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useNotifications();
  const unread = useUnreadNotifications(); // 🔥 Notification badge count

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.header}>Owner Dashboard</Text>
        <Text style={styles.sub}>Welcome back, {user?.fullName || user?.email}</Text>

        {/* Stats Section */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Ionicons name="home-outline" size={28} color="#38bdf8" />}
            label="Active Ads"
            value="12"
          />

          <StatCard
            icon={<MaterialIcons name="event-available" size={28} color="#22c55e" />}
            label="Appointments"
            value="5"
          />

          <StatCard
            icon={<FontAwesome5 name="user-check" size={26} color="#facc15" />}
            label="Registrations"
            value="3"
          />

          <StatCard
            icon={<MaterialIcons name="bolt" size={28} color="#f87171" />}
            label="Pending Bills"
            value="2"
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={{ marginTop: 12, padding: 10, backgroundColor: "#2563eb", borderRadius: 8 }}
          onPress={() => triggerLocalNotification("Test from Expo Go", "This tests notification UI")}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Send Test Notification</Text>
        </TouchableOpacity>



        <View style={styles.actionGrid}>
          <ActionCard
            title="Create New Ad"
            icon={<Ionicons name="add-circle-outline" size={26} color="#3b82f6" />}
            onPress={() => router.push("/owner/ads/create")}
          />

          <ActionCard
            title="My Advertisements"
            icon={<MaterialIcons name="home-work" size={26} color="#38bdf8" />}
            onPress={() => router.push("/owner/ads")}
          />

          <ActionCard
            title="Appointments"
            icon={<MaterialIcons name="event-note" size={26} color="#22c55e" />}
            onPress={() => router.push("/owner/appointments")}
          />

          <ActionCard
            title="Registrations"
            icon={<FontAwesome5 name="clipboard-check" size={22} color="#facc15" />}
            onPress={() => router.push("/owner/registrations")}
          />

          <ActionCard
            title="Monthly Utilities"
            icon={<MaterialIcons name="water-electricity" size={26} color="#f87171" />}
            onPress={() => router.push("/owner/utilities")}
          />

          {/* 🔥 Notifications with Badge */}
          <ActionCard
            title="Notifications"
            icon={<Ionicons name="notifications-outline" size={26} color="#facc15" />}
            badge={unread}
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --------------------------- COMPONENTS --------------------------- */

function StatCard({ icon, label, value }) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ title, icon, badge, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        {icon}

        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 18, paddingBottom: 50 },

  header: { color: "white", fontSize: 28, fontWeight: "700" },
  sub: { fontSize: 14, color: "#94a3b8", marginBottom: 25 },

  /* Stats */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 16,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  statValue: { color: "white", fontSize: 22, fontWeight: "700", marginTop: 8 },
  statLabel: { color: "#94a3b8", marginTop: 4, fontSize: 12 },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 14,
  },

  /* Quick Actions */
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: "center",
  },
  actionIcon: { marginBottom: 10, position: "relative" },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 11,
  },

  actionText: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  logoutBtn: {
    marginTop: 25,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});

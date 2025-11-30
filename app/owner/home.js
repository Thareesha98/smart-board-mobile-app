import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../../auth/AuthContext";
import { useRouter } from "expo-router";

export default function OwnerHome() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Owner Dashboard</Text>

      <Text style={styles.subText}>Welcome, {user?.email}</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Ads</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Appointments</Text>
        </View>
      </View>

      {/* Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* ADD AD */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/owner/ads/create")}
      >
        <Text style={styles.actionText}>Add Boarding Advertisement</Text>
      </TouchableOpacity>

      {/* MANAGE ADS (LIST) */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/owner/ads")}
      >
        <Text style={styles.actionText}>Manage My Advertisements</Text>
      </TouchableOpacity>

      {/* APPOINTMENTS */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/owner/appointments")}
      >
        <Text style={styles.actionText}>Manage Appointments</Text>
      </TouchableOpacity>

      {/* UTILITIES */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => router.push("/owner/utilities")}
      >
        <Text style={styles.actionText}>Add Monthly Utilities</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f7f7f7", marginTop: 40 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subText: { fontSize: 15, opacity: 0.6, marginBottom: 20 },

  statsRow: { flexDirection: "row", marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    margin: 5,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 14, opacity: 0.7 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  actionCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  actionText: { fontSize: 16 },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 8,
  },
  logoutText: { textAlign: "center", color: "white", fontWeight: "bold" },
});

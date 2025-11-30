import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../../auth/AuthContext";

export default function AdminHome() {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text style={styles.subText}>Logged in as {user?.email}</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>34</Text>
          <Text style={styles.statLabel}>Pending Ads</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
      </View>

      {/* Actions */}
      <Text style={styles.sectionTitle}>Admin Tools</Text>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionText}>Approve Boarding Ads</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionText}>View User Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionText}>System Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f7f7f7" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subText: { fontSize: 15, opacity: 0.7, marginBottom: 20 },

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

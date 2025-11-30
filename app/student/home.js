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

export default function StudentHome() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.header}>
          Hello, <Text style={styles.accent}>{user?.fullName || user?.email}</Text>
        </Text>
        <Text style={styles.subHeader}>What would you like to do today?</Text>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.row}>
            <HomeCard
              title="Find Boarding"
              onPress={() => router.push("/student/boardings")}
            />
            <HomeCard
              title="My Payments"
              onPress={() => router.push("/student/payments")}
            />
          </View>

          <View style={styles.row}>
            <HomeCard
              title="Appointments"
              onPress={() => router.push("/student/appointments")}
            />
            <HomeCard
              title="Report Issue"
              onPress={() => router.push("/student/report")}
            />
          </View>
        </View>

        {/* Latest Bill */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Bill</Text>

          <View style={styles.billBox}>
            <Text style={styles.billText}>Boarding Fee: Rs. 12,500</Text>
            <Text style={styles.billText}>Water & Electricity: Rs. 1,600</Text>

            <TouchableOpacity
              style={styles.payButton}
              onPress={() => router.push("/student/payments")}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔹 Reusable Card Component */
function HomeCard({ title, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

/* 🎨 Styles */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f8fafc",
  },
  accent: {
    color: "#38bdf8",
  },
  subHeader: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 25,
  },

  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f8fafc",
    textAlign: "center",
  },

  billBox: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  billText: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 5,
  },

  payButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
  },
  payButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});

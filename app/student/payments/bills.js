import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";

const screenWidth = Dimensions.get("window").width;

export default function MonthlyBills() {
  const { user } = useContext(AuthContext);
  const studentId = user?.id;

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/bills/student/${studentId}`);
      setBills(res.data.slice(-6)); // last 6 months
    } catch (e) {
      console.log("❌ bills error", e);
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

  const chartData = {
    labels: bills.map((b) => b.month),
    datasets: [
      {
        data: bills.map((b) => Number(b.totalAmount)),
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Monthly Bills</Text>
        <Text style={styles.sub}>Last 6 months overview</Text>

        {/* 📊 Chart */}
        {bills.length > 0 && (
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            yAxisSuffix=" Rs"
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}

        {/* 📋 Bills List */}
        {bills.map((b) => (
          <View key={b.id} style={styles.billCard}>
            <View style={styles.row}>
              <Text style={styles.month}>{b.month}</Text>
              <StatusBadge status={b.status} />
            </View>

            <Text style={styles.amount}>Rs. {b.totalAmount}</Text>

            <View style={styles.breakdown}>
              <BreakItem label="Boarding" value={b.boardingFee} />
              <BreakItem label="Electricity" value={b.electricity} />
              <BreakItem label="Water" value={b.water} />
            </View>

            {b.status === "PENDING" && (
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() =>
                  alert("Navigate to Pay Bill screen for bill ID " + b.id)
                }
              >
                <Text style={styles.payText}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatusBadge({ status }) {
  const color =
    status === "PAID" ? "#22c55e" : status === "PENDING" ? "#facc15" : "#64748b";

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function BreakItem({ label, value }) {
  return (
    <View style={styles.breakItem}>
      <Text style={styles.breakLabel}>{label}</Text>
      <Text style={styles.breakValue}>Rs. {value}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const chartConfig = {
  backgroundColor: "#1e293b",
  backgroundGradientFrom: "#1e293b",
  backgroundGradientTo: "#1e293b",
  decimalPlaces: 0,
  color: () => "#38bdf8",
  labelColor: () => "#cbd5e1",
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#0f172a",
  },
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 40 },
  header: { color: "white", fontSize: 24, fontWeight: "700" },
  sub: { color: "#94a3b8", marginBottom: 16 },

  chart: {
    borderRadius: 16,
    marginBottom: 24,
  },

  billCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  month: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  amount: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },

  breakdown: {
    marginTop: 10,
  },
  breakItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  breakLabel: { color: "#94a3b8" },
  breakValue: { color: "#e2e8f0" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: "700",
    color: "black",
    fontSize: 12,
  },

  payBtn: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
  },
  payText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
});

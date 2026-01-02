import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";

const screenWidth = Dimensions.get("window").width - 32;

export default function MonthlyBillsChart() {
  const { user } = useContext(AuthContext);
  const studentId = user?.id;

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await api.get(`/bills/student/${studentId}`);
      setBills(res.data.slice(-6)); // last 6 months
    } catch (e) {
      console.log("❌ bill chart error", e);
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

  if (bills.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.empty}>No billing data available</Text>
      </SafeAreaView>
    );
  }

  /* ---------------- BAR CHART DATA ---------------- */

  const barData = {
    labels: bills.map(b => b.month),
    datasets: [
      {
        data: bills.map(b => Number(b.totalAmount)),
      },
    ],
  };

  /* ---------------- PIE CHART DATA (LAST BILL) ---------------- */

  const latest = bills[bills.length - 1];

  const pieData = [
    {
      name: "Boarding",
      amount: Number(latest.boardingFee),
      color: "#38bdf8",
      legendFontColor: "#e5e7eb",
      legendFontSize: 13,
    },
    {
      name: "Electricity",
      amount: Number(latest.electricity),
      color: "#facc15",
      legendFontColor: "#e5e7eb",
      legendFontSize: 13,
    },
    {
      name: "Water",
      amount: Number(latest.water),
      color: "#22c55e",
      legendFontColor: "#e5e7eb",
      legendFontSize: 13,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Billing Analytics</Text>

        {/* BAR CHART */}
        <Text style={styles.section}>Monthly Bills</Text>
        <View style={styles.card}>
          <BarChart
            data={barData}
            width={screenWidth}
            height={240}
            yAxisLabel="Rs "
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
          />
        </View>

        {/* PIE CHART */}
        <Text style={styles.section}>Latest Bill Breakdown</Text>
        <View style={styles.card}>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </View>

        {/* STATUS */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Latest Bill Status</Text>
          <Text
            style={[
              styles.statusBadge,
              latest.status === "PAID" ? styles.paid : styles.pending,
            ]}
          >
            {latest.status}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- CONFIG ---------------- */

const chartConfig = {
  backgroundGradientFrom: "#1e293b",
  backgroundGradientTo: "#1e293b",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
  labelColor: () => "#e5e7eb",
  propsForBackgroundLines: {
    stroke: "#334155",
  },
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 40 },

  header: { color: "white", fontSize: 24, fontWeight: "700" },

  section: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  statusCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  statusTitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
    overflow: "hidden",
  },
  paid: {
    backgroundColor: "#22c55e",
    color: "#0f172a",
  },
  pending: {
    backgroundColor: "#facc15",
    color: "#0f172a",
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 50,
  },
});

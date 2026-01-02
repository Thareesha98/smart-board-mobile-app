import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import api from "../../../client/api";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/payment/my");
      setPayments(res.data);
    } catch (e) {
      console.log("❌ payment history error", e);
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
        <Text style={styles.header}>Payment History</Text>

        {payments.length === 0 ? (
          <Text style={styles.empty}>No payments made yet.</Text>
        ) : (
          payments.map((p, idx) => (
            <View key={p.id} style={styles.timelineItem}>
              {/* Timeline dot */}
              <View style={styles.lineContainer}>
                <View style={styles.dot} />
                {idx !== payments.length - 1 && <View style={styles.line} />}
              </View>

              {/* Card */}
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.amount}>Rs. {p.amount}</Text>
                  <StatusBadge status={p.status} />
                </View>

                <Text style={styles.meta}>
                  {formatDate(p.paidAt)} • {p.method}
                </Text>

                <Text style={styles.ref}>
                  Transaction: {p.transactionRef}
                </Text>

               {p.receiptUrl && (
                <TouchableOpacity
                    style={styles.receiptBtn}
                    onPress={() =>
                    router.push({
                        pathname: "/student/payments/receipt",
                        params: {
                        receiptUrl: p.receiptUrl,
                        },
                    })
                    }
                >
                    <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="white"
                    />
                    <Text style={styles.receiptText}>View Receipt</Text>
                </TouchableOpacity>
                )}


              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatusBadge({ status }) {
  const map = {
    SUCCESS: "#22c55e",
    FAILED: "#ef4444",
    PENDING: "#facc15",
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: map[status] || "#64748b" },
      ]}
    >
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}




const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 40 },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: 40 },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  lineContainer: {
    alignItems: "center",
    width: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#38bdf8",
    marginTop: 8,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#334155",
    marginTop: 4,
  },

  card: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amount: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  meta: {
    color: "#94a3b8",
    marginTop: 4,
  },

  ref: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 12,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "black",
  },

  receiptBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  receiptText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },
});

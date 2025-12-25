import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { previewReceipt } from "../../utils/receiptPreview";
import { Ionicons } from "@expo/vector-icons";
import { downloadReceipt, shareReceipt } from "../../utils/receiptUtils";

export default function PaymentHistoryCard({ payment }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.amount}>Rs. {payment.amount}</Text>
        <StatusBadge status={payment.status} />
      </View>

      <Text style={styles.meta}>
        {payment.method} • {format(payment.paidAt)}
      </Text>

      {payment.receiptUrl && (
        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
                previewReceipt(payment.receiptUrl, `receipt-${payment.id}.pdf`)
            }
            >
            <Ionicons name="eye-outline" size={18} color="#a78bfa" />
            <Text style={styles.btnText}>View</Text>
         </TouchableOpacity>


          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              downloadReceipt(payment.receiptUrl, `receipt-${payment.id}.pdf`)
            }
          >
            <Ionicons name="download-outline" size={18} color="#38bdf8" />
            <Text style={styles.btnText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              shareReceipt(payment.receiptUrl, `receipt-${payment.id}.pdf`)
            }
          >
            <Ionicons name="share-outline" size={18} color="#22c55e" />
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ---------------- HELPERS ---------------- */

function StatusBadge({ status }) {
  const color =
    status === "SUCCESS"
      ? "#22c55e"
      : status === "FAILED"
      ? "#ef4444"
      : "#facc15";

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function format(date) {
  return new Date(date).toLocaleString();
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  btnText: {
    color: "#e5e7eb",
    marginLeft: 6,
    fontSize: 13,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
  },
});

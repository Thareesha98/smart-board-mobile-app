import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../../client/api";
import { AuthContext } from "../../../../auth/AuthContext";

export default function StudentBoardingDashboard() {
  const { regId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get(`/registrations/${regId}/dashboard`);
      const raw = res.data;

      // 🔥 NORMALIZE BACKEND DTO → UI MODEL
      const timeline = [];

      if (raw.registeredAt) {
        timeline.push({
          label: "Registered to boarding",
          date: raw.registeredAt,
        });
      }

      if (raw.lastPaymentDate) {
        timeline.push({
          label: "Last payment made",
          date: raw.lastPaymentDate,
        });
      }

      if (raw.lastIssueDate) {
        timeline.push({
          label: "Last maintenance activity",
          date: raw.lastIssueDate,
        });
      }

      setData({
        registrationId: raw.registrationId,
        status: raw.status,

        boardingTitle: raw.boardingTitle,
        boardingAddress: raw.boardingAddress,
        ownerName: raw.ownerName,

        finance: {
          thisMonthDue: raw.currentMonthDue,
          dueInDays: raw.dueInDays,
          paymentStatus: raw.paymentStatus,
          lastPaymentDate: raw.lastPaymentDate,
        },

        maintenance: {
          open: raw.openIssues,
          resolved: raw.resolvedIssues,
          lastIssueDate: raw.lastIssueDate,
        },

        rating: {
          avg: raw.averageRating ?? 0,
          yourReviewSubmitted: raw.yourReviewSubmitted,
        },

        timeline,
      });
    } catch (e) {
      console.log("❌ dashboard load error", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>{data.boardingTitle}</Text>
        <Text style={styles.sub}>{data.boardingAddress}</Text>

        {/* QUICK STATUS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StatusCard
            label="This Month Due"
            value={`Rs. ${data.finance.thisMonthDue}`}
            sub={`Due in ${data.finance.dueInDays} days`}
            icon="cash-outline"
          />

          <StatusCard
            label="Maintenance"
            value={`${data.maintenance.open} Open`}
            sub={`${data.maintenance.resolved} Resolved`}
            icon="build-outline"
          />

          <StatusCard
            label="Last Payment"
            value={data.finance.lastPaymentDate ? "Paid" : "—"}
            sub={formatDate(data.finance.lastPaymentDate)}
            icon="checkmark-done-outline"
          />

          <StatusCard
            label="Rating"
            value={`⭐ ${data.rating.avg.toFixed(1)}`}
            sub={
              data.rating.yourReviewSubmitted
                ? "You reviewed"
                : "No review yet"
            }
            icon="star-outline"
          />
        </ScrollView>

        {/* ACTIONS */}
        <ActionCard
          title="Payments & Bills"
          desc="View bills, charts & pay"
          icon="card-outline"
          onPress={() => router.push("/student/payments")}
        />

        <ActionCard
          title="Maintenance Tracker"
          desc="Report & track issues"
          icon="construct-outline"
          onPress={() => router.push("/student/maintenance")}
        />

        <ActionCard
          title="Reviews & Ratings"
          desc="Your feedback & others"
          icon="chatbubble-ellipses-outline"
          onPress={() => router.push("/student/reviews")}
        />

        <ActionCard
          title="Contact Owner"
          desc="Call or message owner"
          icon="call-outline"
          onPress={() => router.push("/student/contact-owner")}
        />

        <ActionCard
          title="Report Boarding"
          desc="Safety & trust"
          icon="alert-circle-outline"
          danger
          onPress={() => router.push("/student/report")}
        />

        {/* TIMELINE */}
        <Text style={styles.sectionTitle}>Activity Timeline</Text>

        {data.timeline.length === 0 ? (
          <Text style={styles.empty}>No recent activity</Text>
        ) : (
          data.timeline.map((t, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View>
                <Text style={styles.timelineText}>{t.label}</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(t.date)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatusCard({ label, value, sub, icon }) {
  return (
    <View style={styles.statusCard}>
      <Ionicons name={icon} size={22} color="#38bdf8" />
      <Text style={styles.statusValue}>{value}</Text>
      <Text style={styles.statusSub}>{sub}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ title, desc, icon, onPress, danger }) {
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        danger && { borderColor: "#ef4444" },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={danger ? "#ef4444" : "#38bdf8"}
      />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------- UTILS ---------------- */

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 60 },

  title: { color: "white", fontSize: 26, fontWeight: "800" },
  sub: { color: "#94a3b8", marginBottom: 16 },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },

  empty: { color: "#94a3b8", marginBottom: 16 },

  statusCard: {
    width: 160,
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statusValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  statusSub: { color: "#94a3b8", marginTop: 2 },
  statusLabel: { color: "#cbd5e1", marginTop: 8 },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  actionDesc: { color: "#94a3b8", marginTop: 2 },

  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#38bdf8",
    marginRight: 12,
  },
  timelineText: { color: "white" },
  timelineDate: { color: "#94a3b8", fontSize: 12 },
});

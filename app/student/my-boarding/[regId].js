import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../client/api";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

export default function StudentBoardingDashboard() {
  const { regId } = useLocalSearchParams();
  const router = useRouter();

  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get(`/registrations/${regId}/dashboard`);
      setDash(res.data);
    } catch (e) {
      console.log("❌ dashboard load error", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!dash) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>{dash.boardingTitle}</Text>
        <Text style={styles.sub}>{dash.boardingAddress}</Text>

        {/* QUICK STATUS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow}>
          <QuickCard
            title="This Month Due"
            value={`Rs. ${dash.currentMonthDue}`}
            sub={`⏳ Due in ${dash.dueInDays} days`}
            color="#facc15"
          />
          <QuickCard
            title="Maintenance"
            value={`${dash.openIssues} Open`}
            sub={`${dash.resolvedIssues} Resolved`}
            color="#38bdf8"
          />
          <QuickCard
            title="Last Payment"
            value={dash.paymentStatus}
            sub={dash.lastPaymentDate || "—"}
            color="#22c55e"
          />
          <QuickCard
            title="Rating"
            value={`⭐ ${dash.averageRating ?? "—"} / 5`}
            sub="Overall"
            color="#f97316"
          />
        </ScrollView>

        {/* PAYMENTS */}
        <DashboardCard
          icon={<MaterialIcons name="payments" size={26} color="#22c55e" />}
          title="Payments & Bills"
          subtitle="View bills, history & pay"
          footer={`Status: ${dash.paymentStatus}`}
          onPress={() => router.push(`/student/payments/${regId}`)}
        />

        {/* MAINTENANCE */}
        <DashboardCard
          icon={<Ionicons name="construct-outline" size={26} color="#38bdf8" />}
          title="Maintenance"
          subtitle="Track issues & requests"
          footer={`Last issue: ${dash.lastIssueDate || "—"}`}
          onPress={() => router.push(`/student/maintenance/${regId}`)}
        />

        {/* RULES */}
        <DashboardCard
          icon={<Ionicons name="document-text-outline" size={26} color="#a78bfa" />}
          title="Boarding Rules"
          subtitle="Curfew, visitors & conduct"
          footer="Last updated by owner"
          onPress={() => router.push(`/student/rules/${regId}`)}
        />

        {/* REVIEWS */}
        <DashboardCard
          icon={<FontAwesome5 name="star-half-alt" size={24} color="#facc15" />}
          title="Reviews & Ratings"
          subtitle="Your review & others"
          footer={
            dash.yourReviewSubmitted
              ? "Your review submitted"
              : "You haven’t reviewed yet"
          }
          onPress={() => router.push(`/student/reviews/${regId}`)}
        />

        {/* CONTACT OWNER */}
        <DashboardCard
          icon={<Ionicons name="call-outline" size={26} color="#22c55e" />}
          title="Contact Owner"
          subtitle={dash.ownerName}
          footer="Usually replies within 1 day"
          onPress={() => router.push(`/student/contact-owner/${regId}`)}
        />

        {/* REPORT */}
        <DashboardCard
          icon={<Ionicons name="alert-circle-outline" size={26} color="#ef4444" />}
          title="Report Boarding"
          subtitle="Safety & complaints"
          footer="No active reports"
          onPress={() => router.push(`/student/report/${regId}`)}
          danger
        />

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function QuickCard({ title, value, sub, color }) {
  return (
    <View style={[styles.quickCard, { borderColor: color }]}>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={[styles.quickValue, { color }]}>{value}</Text>
      <Text style={styles.quickSub}>{sub}</Text>
    </View>
  );
}

function DashboardCard({ icon, title, subtitle, footer, onPress, danger }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, danger && styles.dangerCard]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        {icon}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.cardFooter}>{footer}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },

  container: { padding: 16, paddingBottom: 40 },

  title: { color: "white", fontSize: 24, fontWeight: "800" },
  sub: { color: "#94a3b8", marginBottom: 20 },

  quickRow: { marginBottom: 24 },
  quickCard: {
    width: 165,
    backgroundColor: "#1e293b",
    padding: 14,
    marginRight: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickTitle: { color: "#94a3b8", fontSize: 12 },
  quickValue: { fontSize: 18, fontWeight: "800", marginVertical: 6 },
  quickSub: { color: "#cbd5e1", fontSize: 12 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  dangerCard: {
    borderColor: "#7f1d1d",
    backgroundColor: "#1f2937",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#94a3b8", fontSize: 13 },
  cardFooter: { color: "#cbd5e1", marginTop: 6, fontSize: 12 },
});

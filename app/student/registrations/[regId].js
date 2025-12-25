import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../client/api";
import StatusCard from "../../../components/student/StatusCard";
import ActionCard from "../../../components/student/ActionCard";

export default function StudentBoardingDashboard() {
  const { regId } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get(`/registrations/${regId}/dashboard`);
      setData(res.data);
    } catch (e) {
      console.log("❌ dashboard error", e);
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
        <Text style={styles.title}>{data.boardingTitle}</Text>
        <Text style={styles.sub}>{data.boardingAddress}</Text>

        {/* 🔹 STATUS CARDS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StatusCard
            title="This Month Due"
            value={`Rs. ${data.currentDueAmount}`}
            sub={`Due in ${data.daysRemaining} days`}
            color="#facc15"
          />

          <StatusCard
            title="Maintenance"
            value={`${data.openIssues} Open`}
            sub={`${data.resolvedIssues} Resolved`}
            color="#22c55e"
          />

          <StatusCard
            title="Last Payment"
            value={data.lastPaymentDate || "—"}
            sub="Paid"
            color="#38bdf8"
          />

          <StatusCard
            title="Rating"
            value={`⭐ ${data.rating || "N/A"}`}
            sub="/ 5"
            color="#f97316"
          />
        </ScrollView>

        {/* 🔹 ACTION CARDS */}
        <View style={styles.actions}>
          <ActionCard
            title="Payments & Bills"
            subtitle="View bills & pay"
            onPress={() => router.push(`/student/payments?regId=${regId}`)}
          />

          <ActionCard
            title="Maintenance"
            subtitle="Track issues"
            onPress={() => router.push(`/student/maintenance?regId=${regId}`)}
          />

          <ActionCard
            title="Boarding Rules"
            subtitle="Stay compliant"
            onPress={() => router.push(`/student/rules?regId=${regId}`)}
          />

          <ActionCard
            title="Reviews & Ratings"
            subtitle="Community feedback"
            onPress={() => router.push(`/student/reviews?regId=${regId}`)}
          />

          <ActionCard
            title="Contact Owner"
            subtitle="Call or message"
            onPress={() => router.push(`/student/contact-owner?regId=${regId}`)}
          />

          <ActionCard
            title="Report Boarding"
            subtitle="Safety & trust"
            danger
            onPress={() => router.push(`/student/report?regId=${regId}`)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

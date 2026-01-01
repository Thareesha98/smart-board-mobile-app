import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useLocalSearchParams } from "expo-router";

export default function MaintenanceDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useLocalSearchParams();
  const studentId = user?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
    //   const res = await api.get(`/maintenance/student/${studentId}`);
      const res = await api.get(`/maintenance/student`);
      const found = res.data.find(m => String(m.id) === String(id));
      setItem(found);
    } catch (e) {
      console.log("❌ maintenance detail error", e);
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

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: "white", textAlign: "center" }}>
          Maintenance request not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>{item.title || "Maintenance Issue"}</Text>
        <StatusBadge status={item.status} />

        {/* Description */}
        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {/* Timeline */}
        <Text style={styles.section}>Status Timeline</Text>

        <Timeline status={item.status} ownerNote={item.ownerNote} />

        {/* Images */}
        {item.imageUrls?.length > 0 && (
          <>
            <Text style={styles.section}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.imageUrls.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.image} />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatusBadge({ status }) {
  const map = {
    OPEN: "#facc15",
    IN_PROGRESS: "#38bdf8",
    FIXED: "#22c55e",
  };
  return (
    <View style={[styles.badge, { backgroundColor: map[status] || "#64748b" }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function Timeline({ status, ownerNote }) {
  const steps = [
    { key: "OPEN", label: "Reported" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "FIXED", label: "Fixed" },
  ];

  const activeIndex = steps.findIndex(s => s.key === status);

  return (
    <View style={styles.timeline}>
      {steps.map((s, idx) => (
        <View key={s.key} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.circle,
                idx <= activeIndex && styles.circleActive,
              ]}
            />
            {idx < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  idx < activeIndex && styles.lineActive,
                ]}
              />
            )}
          </View>

          <View style={styles.timelineRight}>
            <Text
              style={[
                styles.stepLabel,
                idx <= activeIndex && styles.stepActive,
              ]}
            >
              {s.label}
            </Text>

            {idx === 1 && ownerNote && (
              <Text style={styles.note}>Owner note: {ownerNote}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 16, paddingBottom: 40 },
  header: { color: "white", fontSize: 22, fontWeight: "700" },

  section: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  desc: { color: "#cbd5e1" },

  badge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "black",
  },

  timeline: { marginTop: 10 },
  timelineItem: { flexDirection: "row" },

  timelineLeft: { alignItems: "center", width: 30 },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#334155",
  },
  circleActive: {
    backgroundColor: "#38bdf8",
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#334155",
  },
  lineActive: {
    backgroundColor: "#38bdf8",
  },

  timelineRight: { paddingBottom: 24 },
  stepLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  stepActive: {
    color: "white",
  },
  note: {
    color: "#cbd5e1",
    marginTop: 4,
    fontSize: 13,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
  },
});

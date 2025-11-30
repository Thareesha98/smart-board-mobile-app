import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useRouter } from "expo-router";

export default function StudentAppointmentsScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const studentId = user?.id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await api.get(`/appointments/student/${studentId}`);
      setAppointments(res.data);
    } catch (err) {
      console.log("❌ Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.put(
        `/appointments/student/${studentId}/${appointmentId}/cancel`
      );

      alert("Appointment cancelled.");
      loadAppointments();
    } catch (err) {
      console.log("❌ Cancel error:", err);
      alert("Unable to cancel appointment.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Appointments</Text>

        {appointments.length === 0 ? (
          <Text style={styles.noData}>No appointments found.</Text>
        ) : (
          appointments.map((appt) => (
            <View key={appt.id} style={styles.card}>
              {/* Title */}
              <Text style={styles.title}>{appt.boardingTitle}</Text>
              <Text style={styles.address}>{appt.boardingAddress}</Text>

              {/* Status */}
              <StatusBadge status={appt.status} />

              {/* Requested times */}
              <View style={styles.timeSection}>
                <Text style={styles.sectionLabel}>Requested Time</Text>
                <Text style={styles.timeText}>
                  {formatDateTime(appt.requestedStartTime)} →{" "}
                  {formatDateTime(appt.requestedEndTime)}
                </Text>
              </View>

              {/* Owner-decided times */}
              {appt.ownerStartTime && (
                <View style={styles.timeSection}>
                  <Text style={styles.sectionLabel}>Owner Confirmed Time</Text>
                  <Text style={styles.timeText}>
                    {formatDateTime(appt.ownerStartTime)} →{" "}
                    {formatDateTime(appt.ownerEndTime)}
                  </Text>
                </View>
              )}

              {/* Notes */}
              {appt.studentNote ? (
                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>Your Note</Text>
                  <Text style={styles.noteText}>{appt.studentNote}</Text>
                </View>
              ) : null}

              {appt.ownerNote ? (
                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>Owner's Note</Text>
                  <Text style={styles.noteText}>{appt.ownerNote}</Text>
                </View>
              ) : null}

              {/* Cancel Button */}
              {appt.status === "PENDING" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelAppointment(appt.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔹 Status Badge Component */
function StatusBadge({ status }) {
  let color = "#64748b";

  if (status === "PENDING") color = "#facc15";
  if (status === "ACCEPTED") color = "#22c55e";
  if (status === "DECLINED") color = "#ef4444";
  if (status === "CANCELLED") color = "#6b7280";

  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

/* 🔧 Helper: Format date */
function formatDateTime(dtString) {
  const d = new Date(dtString);
  return d.toLocaleString();
}

/* 🎨 Styles */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  noData: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  address: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 10,
  },
  statusText: {
    color: "black",
    fontWeight: "700",
    fontSize: 12,
  },
  sectionLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 4,
  },
  timeSection: {
    marginBottom: 10,
  },
  timeText: {
    color: "#38bdf8",
  },
  noteSection: {
    marginBottom: 12,
  },
  noteLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 4,
  },
  noteText: {
    color: "#e2e8f0",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "700",
  },
});

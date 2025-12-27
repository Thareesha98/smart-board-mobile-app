import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";

/* ===================================================== */
export default function OwnerAppointments() {
  const { user } = useContext(AuthContext);

  const ownerId = user?.id;

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  // decision modal state
  const [active, setActive] = useState(null);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [note, setNote] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/appointments/owner/${ownerId}`);
      setItems(res.data);
    } catch (e) {
      console.log("❌ load appointments", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(i => i.status === tab);

  /* ---------- ANDROID SAFE PICKERS ---------- */
  const openStartPicker = () => {
    DateTimePickerAndroid.open({
      value: start,
      mode: "datetime",
      is24Hour: true,
      onChange: (_, date) => date && setStart(date),
    });
  };

  const openEndPicker = () => {
    DateTimePickerAndroid.open({
      value: end,
      mode: "datetime",
      is24Hour: true,
      onChange: (_, date) => date && setEnd(date),
    });
  };

  /* ---------- DECISION ---------- */
  const submitDecision = async (status) => {
    if (status === "ACCEPTED" && start >= end) {
      Alert.alert("Invalid Time", "End time must be after start time");
      return;
    }

    try {
      await api.put(
        `/appointments/owner/${ownerId}/${active.id}`,
        {
          status,
          ownerStartTime: status === "ACCEPTED" ? start : null,
          ownerEndTime: status === "ACCEPTED" ? end : null,
          ownerNote: note,
        }
      );

      Alert.alert("Success", `Appointment ${status}`);
      setActive(null);
      setNote("");
      load();
    } catch (e) {
      console.log("❌ decision error", e);
      Alert.alert("Error", "Failed to update appointment");
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

        <Text style={styles.header}>Appointments</Text>
        <Text style={styles.sub}>Manage student visits</Text>

        {/* TABS */}
        <View style={styles.tabs}>
          {["PENDING", "ACCEPTED", "DECLINED"].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No appointments</Text>
        ) : (
          filtered.map(a => (
            <View key={a.id} style={styles.card}>
              <Text style={styles.title}>Boarding #{a.boardingId}</Text>

              <Text style={styles.time}>
                Requested:
                {" "}
                {new Date(a.requestedStartTime).toLocaleString()}
                {" → "}
                {new Date(a.requestedEndTime).toLocaleString()}
              </Text>

              {a.studentNote && (
                <Text style={styles.note}>📝 {a.studentNote}</Text>
              )}

              {a.status === "PENDING" && (
                <TouchableOpacity
                  style={styles.decideBtn}
                  onPress={() => {
                    setActive(a);
                    setStart(new Date(a.requestedStartTime));
                    setEnd(new Date(a.requestedEndTime));
                  }}
                >
                  <Text style={styles.decideText}>Respond</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {/* DECISION PANEL */}
        {active && (
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Respond to Appointment</Text>

            <TouchableOpacity style={styles.pickerBtn} onPress={openStartPicker}>
              <Text style={styles.pickerText}>
                Start: {start.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerBtn} onPress={openEndPicker}>
              <Text style={styles.pickerText}>
                End: {end.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <Action
                label="Accept"
                color="#22c55e"
                onPress={() => submitDecision("ACCEPTED")}
              />
              <Action
                label="Decline"
                color="#ef4444"
                onPress={() => submitDecision("DECLINED")}
              />
            </View>

            <TouchableOpacity onPress={() => setActive(null)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function Action({ label, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 18 },

  header: { color: "white", fontSize: 28, fontWeight: "800" },
  sub: { color: "#94a3b8", marginBottom: 20 },

  tabs: { flexDirection: "row", marginBottom: 14 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#020617",
    marginRight: 8,
  },
  tabActive: { backgroundColor: "#38bdf8" },
  tabText: { color: "#94a3b8", fontWeight: "700" },
  tabTextActive: { color: "black" },

  empty: { color: "#94a3b8", textAlign: "center", marginTop: 40 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: { color: "white", fontWeight: "700", marginBottom: 6 },
  time: { color: "#38bdf8" },
  note: { color: "#e2e8f0", marginTop: 6 },

  decideBtn: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  decideText: { color: "white", fontWeight: "700" },

  modal: {
    backgroundColor: "#020617",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalTitle: { color: "white", fontWeight: "800", marginBottom: 10 },

  pickerBtn: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  pickerText: { color: "#38bdf8" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: { color: "black", fontWeight: "800" },

  cancel: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 10,
  },
});

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
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useRouter } from "expo-router";

export default function OwnerRegistrations() {
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;
  const router = useRouter();

  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/registrations/owner/${ownerId}`); // optional status param can be added
      setRegs(res.data);
    } catch (err) {
      console.log("❌ owner regs", err);
    } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Registrations</Text>

        {regs.length === 0 ? (
          <Text style={styles.noData}>No registrations found.</Text>
        ) : (
          regs.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.card}
              onPress={() => router.push(`/owner/registrations/${r.id}`)}
            >
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{r.boardingTitle}</Text>
                  <Text style={styles.sub}>{r.boardingAddress}</Text>
                </View>
                <View style={[styles.statusPill, statusStyle(r.status).pill]}>
                  <Text style={[styles.statusText, statusStyle(r.status).text]}>{r.status}</Text>
                </View>
              </View>

              <Text style={styles.info}>Student: {r.studentName}</Text>
              <Text style={styles.info}>Students: {r.numberOfStudents}</Text>
              <Text style={styles.info}>Key money: Rs {r.keyMoney}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function statusStyle(status) {
  if (status === "PENDING") return { pill: { backgroundColor: "#facc15" }, text: { color: "black" } };
  if (status === "APPROVED") return { pill: { backgroundColor: "#22c55e" }, text: { color: "black" } };
  return { pill: { backgroundColor: "#ef4444" }, text: { color: "white" } };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" },
  container: { padding: 16, paddingBottom: 40 },
  header: { color: "white", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  noData: { color: "#94a3b8", textAlign: "center", marginTop: 20 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { color: "white", fontSize: 16, fontWeight: "700" },
  sub: { color: "#94a3b8", marginTop: 4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  statusText: { fontWeight: "700" },

  info: { color: "#cbd5e1", marginTop: 8 },
});

// app/notifications/index.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../client/api";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

/*
  Expected backend endpoints (adjust if different):
  GET  /api/notifications/user/{userId}         -> returns list of Notification DTOs (most recent first)
  PUT  /api/notifications/{notificationId}/read -> marks single notification read
  PUT  /api/notifications/mark-all-read         -> marks all for user read (optional)
*/

function NotificationItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardRow}>
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        <View style={styles.meta}>
          {!item.read && (
            <View style={styles.unreadDot} />
          )}
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const userId = user?.id;

  const [notifs, setNotifs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/notifications/user/${userId}`);
      // Expect backend to return a list of Notification DTOs
      // Normalize field names if needed: notificationId -> id, createdAt, read, title, message, meta
      setNotifs(res.data);
    } catch (err) {
      console.log("❌ load notifications", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handlePress = async (item) => {
    try {
      // Mark read locally early for snappy UI:
      setNotifs((prev) =>
        prev.map((n) => (n.notificationId === item.notificationId ? { ...n, read: true } : n))
      );

      // Fire server to mark read (safe if already read)
      await api.put(`/notifications/${item.notificationId}/read`);

      // Optionally deep link to relevant screen using meta:
      // meta is JSON string on your model. Try parse
      try {
        const meta = item.meta ? JSON.parse(item.meta) : {};
        if (meta.bookingId) {
          router.push(`/student/boardings/${meta.bookingId}`);
          return;
        }
        if (meta.appointmentId) {
          // open appointment detail (student or owner)
          router.push(`/student/appointments/${meta.appointmentId}`);
          return;
        }
        // otherwise go to a generic notifications detail screen or just stay
        router.push("/notifications/detail", { notificationId: item.notificationId });
      } catch (e) {
        // fallback: open notifications detail page or do nothing
        router.push("/notifications/detail", { notificationId: item.notificationId });
      }
    } catch (err) {
      console.log("❌ mark read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put(`/notifications/mark-all-read`, { userId }); // adjust if backend requires path param
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.log("❌ mark all read", err);
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Notifications</Text>
        <View style={styles.headerRight}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <MaterialIcons name="done-all" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#2563eb" /></View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(item) => item.notificationId}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={handlePress} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  headerRow: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  header: { color: "white", fontSize: 22, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  unreadCount: { color: "#facc15", fontWeight: "700", marginRight: 8 },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: 30 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: "#facc15" },
  cardRow: { flexDirection: "row", alignItems: "flex-start" },
  left: { flex: 1 },
  title: { color: "white", fontSize: 15, fontWeight: "700" },
  message: { color: "#cbd5e1", marginTop: 6, fontSize: 13 },
  meta: { marginLeft: 12, alignItems: "flex-end" },
  time: { color: "#94a3b8", fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#facc15", marginBottom: 6 },
  markAllBtn: { marginLeft: 8, backgroundColor: "#f1f5f9", padding: 8, borderRadius: 8 },
});

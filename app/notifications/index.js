import React, { useEffect, useState, useCallback } from "react";
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
import api from "../../client/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -----------------------------
  // Load all notifications
  // -----------------------------
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setItems(res.data);
    } catch (err) {
      console.log("❌ Load notifications error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // Load unread count
  // -----------------------------
  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnread(res.data);
    } catch (err) {
      console.log("❌ Load unread count error:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    await loadUnreadCount();
    setRefreshing(false);
  };

  // -----------------------------
  // Mark Single Notification as Read
  // -----------------------------
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      setItems((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, read: true } : n
        )
      );
      loadUnreadCount();
    } catch (err) {
      console.log("❌ Mark read error:", err);
    }
  };

  // -----------------------------
  // Mark All Read
  // -----------------------------
  const markAllRead = async () => {
    try {
      await api.put(`/notifications/read-all`);

      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch (err) {
      console.log("❌ mark all read:", err);
    }
  };

  // Notification card UI
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.notificationId)}
      activeOpacity={0.85}
      style={[styles.card, !item.read && styles.unreadCard]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </View>

      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Notifications</Text>

        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <MaterialIcons name="done-all" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.unreadCount}>Unread: {unread}</Text>

      {/* Notification List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.notificationId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
  },
  headerRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  markAllBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
  },
  unreadCount: {
    color: "#94a3b8",
    paddingLeft: 16,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#facc15",
  },
  row: { flexDirection: "row" },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#facc15",
    marginLeft: 10,
  },
  title: { color: "white", fontSize: 16, fontWeight: "600" },
  message: { color: "#cbd5e1", marginTop: 6 },
  time: { color: "#64748b", marginTop: 8, fontSize: 12 },
  empty: { color: "#64748b", textAlign: "center", marginTop: 30 },
});

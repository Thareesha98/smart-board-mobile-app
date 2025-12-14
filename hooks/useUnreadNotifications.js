// hooks/useUnreadNotifications.js
import { useEffect, useState, useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../client/api";
import { AuthContext } from "../auth/AuthContext";

export default function useUnreadNotifications() {
  const { user } = useContext(AuthContext);
  const [unread, setUnread] = useState(0);
  const isFocused = useIsFocused();

  const loadUnread = async () => {
    try {
      // --------------------------------------------
      // 🔥 DEBUG: Check stored user at request time
      // --------------------------------------------
      const raw = await AsyncStorage.getItem("user");
      console.log("DEBUG stored user:", raw);

      // If raw === null or {} → your interceptor cannot send X-User-Email

      const res = await api.get("/notifications/unread-count");
      setUnread(res.data);
    } catch (err) {
      console.log("❌ unread count error:", err);
    }
  };

  useEffect(() => {
    // wait until AuthContext user is loaded
    if (!user) return;

    if (isFocused) {
      loadUnread();
    }

    const interval = setInterval(loadUnread, 10000);
    return () => clearInterval(interval);
  }, [isFocused, user]);

  return unread;
}

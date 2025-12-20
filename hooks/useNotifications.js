// hooks/useNotifications.js
import { useEffect, useRef, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../client/api";
import { AuthContext } from "../auth/AuthContext";

// show alerts/snackbars for foreground notifications (this is safe)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function triggerLocalNotification(title = "Test", body = "This is a local test") {
  // Fire-and-forget local notification — useful in Expo Go
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { test: true },
    },
    trigger: null, // immediate
  }).catch((e) => console.log("Local notification error:", e));
}

export default function useNotifications() {
  const { user } = useContext(AuthContext);
  const responseListener = useRef();
  const receivedListener = useRef();

  useEffect(() => {
    if (!user) return;

    // attempt registration, but don't crash on failure
    (async () => {
      try {
        await registerForPush();
      } catch (err) {
        // we swallow errors so app doesn't crash in Expo Go
        console.log("❌ Push registration error (non-fatal):", err);
      }
    })();

    // foreground handler
    receivedListener.current = Notifications.addNotificationReceivedListener((notif) => {
      console.log("Foreground notif received:", notif);
      // optionally refresh in-app list here by emitting event or calling your loader
    });

    // user tapped a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
      // deep link handling can go here: inspect response.notification.request.content.data
    });

    return () => {
    //  if (receivedListener.current) Notifications.removeNotificationSubscription(receivedListener.current);
     // if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);
}

async function registerForPush() {
  if (!Device.isDevice) {
    console.log("⚠️ Push notifications require a real device — running in simulator/Expo Go may be limited.");
    return;
  }

  // Ask permission
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Push permissions not granted");
    return;
  }

  // Try to get token — this can throw "No projectId found" in some setups.
  let tokenData;
  try {
    tokenData = await Notifications.getExpoPushTokenAsync();
  } catch (err) {
    // non-fatal: show instructions in console
    console.log("⚠️ Couldn't get Expo push token:", err?.message || err);
    // If you want to explicitly surface to user, do so here.
    return;
  }

  const expoToken = tokenData?.data;
  if (!expoToken) {
    console.log("⚠️ No expo token returned.");
    return;
  }

  console.log("📨 Expo token:", expoToken);

  // persist locally
  try { await SecureStore.setItemAsync("expoPushToken", expoToken); } catch {}

  // read user email from AsyncStorage (safe fallback)
  let email = null;
  try {
    const userJson = await AsyncStorage.getItem("user");
    if (userJson) {
      email = JSON.parse(userJson).email;
    }
  } catch (e) { /* ignore */ }

  // Send to backend (best-effort)
  try {
    await api.post("/notifications/register-token", { expoToken, email });
    console.log("✅ Expo token registered on backend");
  } catch (err) {
    console.log("⚠️ Failed to register token on backend (non-fatal):", err?.message || err);
  }
}

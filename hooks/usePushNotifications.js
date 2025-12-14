// hooks/usePushNotifications.js
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import api from "../client/api";
import * as SecureStore from "expo-secure-store"; // optional to persist token
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";

/**
 * Call this hook from a top-level component (App entry or Student/Owner home)
 * Example: in StudentHome and OwnerHome useEffect(() => registerPush(), [])
 */

export default function usePushNotifications() {
  const { user } = useContext(AuthContext);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (!user) return;

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        sendTokenToBackend(user.id, token);
      }
    });

    // foreground notifications handler
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // optional: update local store or show in-app banner
      console.log("Foreground notification received", notification);
    });

    // user tapped on a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification tapped:", response);
      // optionally deep link based on response.notification.request.content.data
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);
}

// Request permissions & get the expo push token
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Failed to get push token permission!");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  try {
    await SecureStore.setItemAsync("expoPushToken", token);
  } catch {}
  return token;
}

// send token to backend to save mapping userId -> expoToken
async function sendTokenToBackend(userId, expoToken) {
  try {
    await api.post("/notifications/register-token", {
      userId,
      expoPushToken: expoToken,
    });
  } catch (err) {
    console.log("❌ send token error", err);
  }
}

import { Stack, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, AuthContext } from "../auth/AuthContext";
import { useContext, useEffect } from "react";

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user?.role === "STUDENT") {
      router.replace("/(tabs)/student/dashboard");
    } else if (user?.role === "OWNER") {
      router.replace("/(tabs)/owner/dashboard");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user && (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="verify-otp" />
        </>
      )}

      {user?.role === "STUDENT" && (
        <Stack.Screen name="(tabs)/student" />
      )}

      {user?.role === "OWNER" && (
        <Stack.Screen name="(tabs)/owner" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

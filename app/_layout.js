import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, AuthContext } from "../auth/AuthContext";
import { useContext, useEffect } from "react";

function NavigationGate() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === undefined || segments[0] === "register" || segments[0] === "login";

    if (!user && !inAuth) {
      router.replace("/");
      return;
    }

    if (user && inAuth) {
      if (user.role === "OWNER") router.replace("/owner/home");
      else if (user.role === "STUDENT") router.replace("/student/home");
      else if (user.role === "ADMIN") router.replace("/admin/home");
    }
  }, [user, loading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGate />
    </AuthProvider>
  );
}

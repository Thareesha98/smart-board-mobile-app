import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



import api from "../../client/api";
import { AuthContext } from "../../auth/AuthContext";
import ImagePickerComponent from "../../components/ImagePickerComponent";
import { uploadImage } from "../../client/upload";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
    const router = useRouter();  


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const url =
        user.role === "OWNER"
          ? "/owner/profile"
          : "/student/profile";

      const res = await api.get(url);
      setProfile(res.data);
    } catch (e) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      let profileImageUrl = profile.profileImageUrl;

      if (image) {
        profileImageUrl = await uploadImage(image, "profiles");
      }

      const payload =
        user.role === "OWNER"
          ? {
              fullName: profile.fullName,
              phone: profile.phone,
              accNo: profile.accNo,
              profileImageUrl,
            }
          : {
              fullName: profile.fullName,
              phone: profile.phone,
              studentUniversity: profile.studentUniversity,
              profileImageUrl,
            };

      const url =
        user.role === "OWNER"
          ? "/owner/profile"
          : "/student/profile";

      await api.put(url, payload);

      Alert.alert("Success", "Profile updated successfully");
      setImage(null);
    } catch (e) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <Text style={styles.header}>My Profile</Text>

        {/* PROFILE IMAGE */}
        <View style={styles.avatarBox}>
          <Image
            source={{
              uri:
                image ||
                profile.profileImageUrl ||
                "https://i.pravatar.cc/300",
            }}
            style={styles.avatar}
          />
          <ImagePickerComponent
            images={image ? [image] : []}
            setImages={(imgs) => setImage(imgs[0])}
            multiple={false}
          />
        </View>

        {/* BASIC INFO */}
        <Label label="Full Name" />
        <TextInput
          style={styles.input}
          value={profile.fullName || ""}
          onChangeText={(v) => updateField("fullName", v)}
        />

        <Label label="Email (read-only)" />
        <TextInput
          style={[styles.input, styles.disabled]}
          value={profile.email}
          editable={false}
        />

        <Label label="Phone" />
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={profile.phone || ""}
          onChangeText={(v) => updateField("phone", v)}
        />

        {/* ROLE-SPECIFIC */}
        {user.role === "STUDENT" && (
          <>
            <Label label="University" />
            <TextInput
              style={styles.input}
              value={profile.studentUniversity || ""}
              onChangeText={(v) =>
                updateField("studentUniversity", v)
              }
            />
          </>
        )}

        {user.role === "OWNER" && (
          <>
            <Label label="Bank Account Number" />
            <TextInput
              style={styles.input}
              value={profile.accNo || ""}
              onChangeText={(v) => updateField("accNo", v)}
            />
          </>
        )}

        


        {/* SAVE */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={saveProfile}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{
            marginTop: 14,
            borderWidth: 1,
            borderColor: "#334155",
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
        }}
        onPress={() => router.push("/change-password/request")}
        >
        <Text style={{ color: "#38bdf8", fontWeight: "700" }}>
            Change Password
        </Text>
        </TouchableOpacity>



        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= UI HELPERS ================= */

function Label({ label }) {
  return <Text style={styles.label}>{label}</Text>;
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  container: { padding: 18, paddingBottom: 40 },

  header: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },

  avatarBox: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  label: {
    color: "#94a3b8",
    marginBottom: 6,
    fontSize: 13,
  },

  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    color: "white",
    marginBottom: 14,
  },
  disabled: {
    opacity: 0.6,
  },

  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});

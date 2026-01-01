import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CreateMaintenance() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { boardingId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState([]);
  const [sending, setSending] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImages(prev => [...prev, res.assets[0]]);
    }
  };

  const uploadImagesToS3 = async () => {
    if (!images.length) return [];

    const formData = new FormData();
    images.forEach((img, i) => {
      formData.append("files", {
        uri: img.uri,
        name: `maintenance_${i}.jpg`,
        type: "image/jpeg",
      });
    });

    const res = await api.post(
      "/files/upload-multiple/maintenance",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data; // ✅ S3 URLs
  };

  const submit = async () => {
    if (!title || !desc) {
      Alert.alert("Missing info", "Title & description required");
      return;
    }

    if (!boardingId) {
      Alert.alert("Error", "Boarding not selected");
      return;
    }

    try {
      setSending(true);

      const imageUrls = await uploadImagesToS3();

      await api.post("/maintenance", {
        boardingId: Number(boardingId),
        title,
        description: desc,
        studentNote: note,
        imageUrls, // ✅ S3 URLs
      });

      Alert.alert("Success 🎉", "Maintenance request submitted");
      router.replace("/student/maintenance");
    } catch (e) {
      console.log("❌ create maintenance", e?.response?.data || e);
      Alert.alert("Error", "Failed to submit request");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>New Maintenance</Text>

        <TextInput
          style={styles.input}
          placeholder="Issue title"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe the issue"
          placeholderTextColor="#94a3b8"
          multiline
          value={desc}
          onChangeText={setDesc}
        />

        <TextInput
          style={styles.input}
          placeholder="Additional note (optional)"
          placeholderTextColor="#94a3b8"
          value={note}
          onChangeText={setNote}
        />

        <Text style={styles.section}>Photos</Text>

        <ScrollView horizontal>
          {images.map((img, i) => (
            <View key={i} style={styles.imageWrap}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.remove}
                onPress={() =>
                  setImages(images.filter((_, idx) => idx !== i))
                }
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addImage} onPress={pickImage}>
            <Ionicons name="camera-outline" size={28} color="#38bdf8" />
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.submit, sending && { opacity: 0.6 }]}
          onPress={submit}
          disabled={sending}
        >
          <Text style={styles.submitText}>
            {sending ? "Submitting..." : "Submit Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 16, paddingBottom: 40 },

  header: { color: "white", fontSize: 26, fontWeight: "800", marginBottom: 16 },
  section: { color: "#94a3b8", marginBottom: 8, marginTop: 12 },

  input: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#334155",
  },
  textarea: { height: 100, textAlignVertical: "top" },

  imageWrap: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  remove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    padding: 2,
  },
  addImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#38bdf8",
    justifyContent: "center",
    alignItems: "center",
  },

  submit: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  submitText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
});

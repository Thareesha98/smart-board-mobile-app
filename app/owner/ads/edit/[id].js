import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";

import api from "../../../../client/api";
import { AuthContext } from "../../../../auth/AuthContext";

import ImagePickerComponent from "../../../../components/ImagePickerComponent";
import { uploadMultipleImages } from "../../../../client/upload";

import GenderSelector from "../../../../components/owner/GenderSelector";
import BoardingTypeSelector from "../../../../components/owner/BoardingTypeSelector";
import AmenitiesSelector from "../../../../components/owner/AmenitiesSelector";
import NearbyPlaces from "../../../../components/owner/NearbyPlaces";
import DistrictSelector from "../../../../components/owner/DistrictSelector";

const PLACEHOLDER_COLOR = "#8e8e8e";

/* ====================================================== */
export default function EditAd() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState(null);

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Colombo");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState({});

  /* ================= LOAD ================= */
  const loadAd = async () => {
    try {
      const res = await api.get(`/boardings/owner`);
      const found = res.data.find((a) => a.id == id);

      if (!found) {
        Alert.alert("Error", "Advertisement not found");
        router.back();
        return;
      }

      const parts = (found.address || "").split(",").map((p) => p.trim());
      setAddressLine(parts[0] || "");
      setCity(parts[1] || "");
      setDistrict(parts[2] || "Colombo");

      setForm({
        title: found.title || "",
        description: found.description || "",
        pricePerMonth: String(found.pricePerMonth || ""),
        keyMoney: String(found.keyMoney || ""),          // ✅ ADDED
        genderType: found.genderType || "BOTH",
        availableSlots: String(found.availableSlots || ""),
        maxOccupants: found.maxOccupants
          ? String(found.maxOccupants)
          : "",
        boardingType: found.boardingType || "ROOM",
      });

      setExistingImages(found.imageUrls || []);
      setAmenities(found.amenities || []);
      setNearbyPlaces(found.nearbyPlaces || {});
      setNewImages([]);
    } catch (err) {
      console.log("❌ load ad error", err);
      Alert.alert("Error", "Failed to load advertisement");
    }
  };

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const removeExistingImage = (index) => {
    const arr = [...existingImages];
    arr.splice(index, 1);
    setExistingImages(arr);
  };

  /* ================= SAVE ================= */

/* ================= SAVE ================= */
const save = async () => {
  try {
    let uploadedNewImages = [];
    if (newImages.length > 0) {
      uploadedNewImages = await uploadMultipleImages(newImages, "boarding");
    }

    const finalImageUrls = [...existingImages, ...uploadedNewImages];
    const fullAddress = `${addressLine}, ${city}, ${district}`;

    const payload = {
      title: form.title,
      description: form.description,
      address: fullAddress,
      pricePerMonth: parseFloat(form.pricePerMonth),
      keyMoney: form.keyMoney ? parseFloat(form.keyMoney) : 0,
      genderType: form.genderType,
      availableSlots: parseInt(form.availableSlots || "0", 10),
      maxOccupants: form.maxOccupants
        ? parseInt(form.maxOccupants, 10)
        : null,
      boardingType: form.boardingType,
      imageUrls: finalImageUrls,
      amenities,
      nearbyPlaces,
    };

    // ✅ JWT-based update (NO ownerId)
    await api.put(`/boardings/owner/${id}`, payload);

    Alert.alert("Success", "Advertisement updated successfully!");
    router.back();
  } catch (err) {
    console.log("❌ update error", err?.response?.data || err);
    Alert.alert("Error", "Failed to update advertisement");
  }
};

/* ================= DELETE ================= */
const removeAd = async () => {
  try {
    // ✅ JWT-based delete (NO ownerId)
    await api.delete(`/boardings/owner/${id}`);
    Alert.alert("Deleted", "Advertisement deleted successfully");
    router.replace("/owner/ads");
  } catch (err) {
    console.log("❌ delete error", err?.response?.data || err);
    Alert.alert("Error", "Failed to delete advertisement");
  }
};



  useEffect(() => {
    loadAd();
  }, []);

  if (!form) {
    return (
      <View style={styles.loadingBox}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Boarding Advertisement</Text>

      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(t) => update("title", t)}
        placeholder="Title"
        placeholderTextColor={PLACEHOLDER_COLOR}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        value={form.description}
        onChangeText={(t) => update("description", t)}
        placeholder="Description"
        placeholderTextColor={PLACEHOLDER_COLOR}
        multiline
      />

      <Text style={styles.sectionTitle}>Address</Text>

      <TextInput
        style={styles.input}
        placeholder="Number & Lane"
        value={addressLine}
        onChangeText={setAddressLine}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <DistrictSelector value={district} onChange={setDistrict} />

      <Text style={styles.sectionTitle}>Pricing</Text>

      <TextInput
        style={styles.input}
        value={form.pricePerMonth}
        onChangeText={(t) => update("pricePerMonth", t)}
        placeholder="Monthly Rent (Rs)"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={form.keyMoney}
        onChangeText={(t) => update("keyMoney", t)}
        placeholder="Key Money (Rs) – optional"
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          placeholder="Available Slots"
          keyboardType="numeric"
          value={form.availableSlots}
          onChangeText={(t) => update("availableSlots", t)}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          placeholder="Max Occupants"
          keyboardType="numeric"
          value={form.maxOccupants}
          onChangeText={(t) => update("maxOccupants", t)}
        />
      </View>

      <GenderSelector
        value={form.genderType}
        onChange={(val) => update("genderType", val)}
      />

      <BoardingTypeSelector
        value={form.boardingType}
        onChange={(val) => update("boardingType", val)}
      />

      <AmenitiesSelector amenities={amenities} setAmenities={setAmenities} />
      <NearbyPlaces places={nearbyPlaces} setPlaces={setNearbyPlaces} />

      <Text style={styles.sectionTitle}>Images</Text>

      {/* Existing images */}
      <View style={styles.previewRow}>
        {existingImages.map((url, idx) => (
          <View key={idx} style={{ position: "relative" }}>
            <Image source={{ uri: url }} style={styles.preview} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeExistingImage(idx)}
            >
              <Text style={styles.deleteTxt}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ImagePickerComponent
        images={newImages}
        setImages={setNewImages}
        multiple
      />

      <View style={styles.previewRow}>
        {newImages.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.preview} />
        ))}
      </View>

      <Button title="Save Changes" onPress={save} />
      <View style={{ height: 10 }} />
      <Button title="Delete Advertisement" color="red" onPress={removeAd} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 15, marginTop: 30 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
    color: "black",
  },

  row: { flexDirection: "row", marginBottom: 10 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },

  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },

  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },

  deleteBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

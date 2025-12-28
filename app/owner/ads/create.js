import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

import api from "../../../client/api";
import { AuthContext } from "../../../auth/AuthContext";

import ImagePickerComponent from "../../../components/ImagePickerComponent";
import { uploadMultipleImages } from "../../../client/upload";

import GenderSelector from "../../../components/owner/GenderSelector";
import BoardingTypeSelector from "../../../components/owner/BoardingTypeSelector";
import AmenitiesSelector from "../../../components/owner/AmenitiesSelector";
import NearbyPlaces from "../../../components/owner/NearbyPlaces";
import DistrictSelector from "../../../components/owner/DistrictSelector";

const PLACEHOLDER_COLOR = "#8e8e8e";

/* ====================================================== */
export default function CreateAd() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pricePerMonth: "",
    keyMoney: "",                 // ✅ ADDED
    genderType: "BOTH",
    availableSlots: "",
    maxOccupants: "",
    boardingType: "ROOM",
  });

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Colombo");

  const [amenities, setAmenities] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  /* ===================== CREATE ===================== */
  const createAd = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!form.title || !form.pricePerMonth || !form.availableSlots) {
        Alert.alert("Missing Data", "Please fill required fields");
        setIsSubmitting(false);
        return;
      }

      const fullAddress = `${addressLine}, ${city}, ${district}`;

      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images, "boarding");
      }

      const payload = {
        title: form.title,
        description: form.description,
        address: fullAddress,
        pricePerMonth: parseFloat(form.pricePerMonth),
        keyMoney: form.keyMoney ? parseFloat(form.keyMoney) : 0, // ✅ INCLUDED
        genderType: form.genderType,
        availableSlots: parseInt(form.availableSlots),
        maxOccupants: form.maxOccupants
          ? parseInt(form.maxOccupants)
          : null,
        boardingType: form.boardingType,
        imageUrls,
        amenities,
        nearbyPlaces,
      };

      await api.post(`/boardings/owner`, payload);

      Alert.alert("Success", "Boarding advertisement created!");
      router.replace("/owner/ads");
    } catch (error) {
      console.log("❌ create ad error", error);
      Alert.alert("Error", "Failed to create advertisement");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Boarding Advertisement</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={form.title}
        onChangeText={(t) => update("title", t)}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        placeholderTextColor={PLACEHOLDER_COLOR}
        multiline
        value={form.description}
        onChangeText={(t) => update("description", t)}
      />

      {/* ADDRESS */}
      <TextInput
        style={styles.input}
        placeholder="Number & Lane"
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={addressLine}
        onChangeText={setAddressLine}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={city}
        onChangeText={setCity}
      />

      <DistrictSelector value={district} onChange={setDistrict} />

      {/* PRICING */}
      <Text style={styles.sectionTitle}>Pricing</Text>

      <TextInput
        style={styles.input}
        placeholder="Monthly Rent (Rs)"
        placeholderTextColor={PLACEHOLDER_COLOR}
        keyboardType="numeric"
        value={form.pricePerMonth}
        onChangeText={(t) => update("pricePerMonth", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Key Money (Rs) – optional"
        placeholderTextColor={PLACEHOLDER_COLOR}
        keyboardType="numeric"
        value={form.keyMoney}
        onChangeText={(t) => update("keyMoney", t)}
      />

      {/* CAPACITY */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          placeholder="Available Slots"
          placeholderTextColor={PLACEHOLDER_COLOR}
          keyboardType="numeric"
          value={form.availableSlots}
          onChangeText={(t) => update("availableSlots", t)}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          placeholder="Max Occupants"
          placeholderTextColor={PLACEHOLDER_COLOR}
          keyboardType="numeric"
          value={form.maxOccupants}
          onChangeText={(t) => update("maxOccupants", t)}
        />
      </View>

      {/* SELECTORS */}
      <GenderSelector
        value={form.genderType}
        onChange={(val) => update("genderType", val)}
      />

      <BoardingTypeSelector
        value={form.boardingType}
        onChange={(val) => update("boardingType", val)}
      />

      <AmenitiesSelector
        amenities={amenities}
        setAmenities={setAmenities}
      />

      <NearbyPlaces
        places={nearbyPlaces}
        setPlaces={setNearbyPlaces}
      />

      {/* IMAGES */}
      <Text style={styles.sectionTitle}>Images</Text>

      <ImagePickerComponent
        images={images}
        setImages={setImages}
        multiple
      />

      <View style={styles.previewRow}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.preview} />
        ))}
      </View>

      <Button
        title={isSubmitting ? "Saving..." : "Create Advertisement"}
        onPress={createAd}
        disabled={isSubmitting}
      />
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
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

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 6,
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
});

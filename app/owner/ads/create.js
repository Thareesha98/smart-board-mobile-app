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

export default function CreateAd() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pricePerMonth: "",
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

  const createAd = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Address combined
      const fullAddress = `${addressLine}, ${city}, ${district}`;

      // Upload images
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images, "boarding");
      }

      const payload = {
        title: form.title,
        description: form.description,
        address: fullAddress,
        pricePerMonth: parseFloat(form.pricePerMonth),
        genderType: form.genderType,
        availableSlots: parseInt(form.availableSlots),
        maxOccupants: form.maxOccupants ? parseInt(form.maxOccupants) : null,
        boardingType: form.boardingType,
        imageUrls,
        amenities,
        nearbyPlaces,
      };

      await api.post(`/owner/ads/${user.id}`, payload);

      Alert.alert("Success", "Boarding advertisement created!");
      router.replace("/owner/ads");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create advertisement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Boarding Advertisement</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={form.title}
        onChangeText={(t) => update("title", t)}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        multiline
        value={form.description}
        onChangeText={(t) => update("description", t)}
      />

      {/* Address fields */}
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

      <TextInput
        style={styles.input}
        placeholder="Price per Month (Rs)"
        keyboardType="numeric"
        value={form.pricePerMonth}
        onChangeText={(t) => update("pricePerMonth", t)}
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
      <ImagePickerComponent
        images={images}
        setImages={setImages}
        multiple={true}
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
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
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
});

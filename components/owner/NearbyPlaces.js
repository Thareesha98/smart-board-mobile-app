import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function NearbyPlaces({ places, setPlaces }) {
  const [place, setPlace] = useState("");
  const [distance, setDistance] = useState("");

  const addPlace = () => {
    if (!place || !distance) return;

    setPlaces({
      ...places,
      [place]: parseFloat(distance),
    });

    setPlace("");
    setDistance("");
  };

  const removePlace = (key) => {
    const copy = { ...places };
    delete copy[key];
    setPlaces(copy);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.label}>Nearby Places</Text>

      {/* Input row */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Place"
          value={place}
          onChangeText={setPlace}
        />

        <TextInput
          style={[styles.input, { width: 90 }]}
          placeholder="KM"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addPlace}>
          <Text style={styles.addTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Display added places */}
      {Object.keys(places).map((key) => (
        <View key={key} style={styles.placeRow}>
          <Text style={styles.placeText}>
            {key} - {places[key]} km
          </Text>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removePlace(key)}
          >
            <Text style={styles.removeTxt}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  addTxt: { color: "white", fontSize: 18, fontWeight: "bold" },
  placeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  placeText: { fontSize: 15 },
  removeBtn: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  removeTxt: { color: "white", fontWeight: "bold" },
});

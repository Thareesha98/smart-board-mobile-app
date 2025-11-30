import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AMENITY_LIST = [
  "WiFi",
  "Parking",
  "Hot Water",
  "Furnished",
  "AC Room",
  "Kitchen Access",
  "Laundry",
];

export default function AmenitiesSelector({ amenities, setAmenities }) {
  const toggle = (a) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter((x) => x !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Amenities</Text>

      <View style={styles.container}>
        {AMENITY_LIST.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggle(item)}
            style={[
              styles.option,
              amenities.includes(item) && styles.selected
            ]}
          >
            <Text
              style={[
                styles.text,
                amenities.includes(item) && styles.textSel
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginVertical: 6 },
  container: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },
  selected: { backgroundColor: "#6f42c1", borderColor: "#6f42c1" },
  text: { color: "#000" },
  textSel: { color: "white", fontWeight: "600" },
});

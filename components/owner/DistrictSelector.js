import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function DistrictSelector({ value, onChange }) {
  const districts = [
    "Colombo", "Gampaha", "Kalutara",
    "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar",
    "Vavuniya", "Mullaitivu",
    "Batticaloa", "Ampara", "Trincomalee",
    "Kurunegala", "Puttalam",
    "Anuradhapura", "Polonnaruwa",
    "Badulla", "Monaragala",
    "Ratnapura", "Kegalle"
  ];

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>District</Text>

      <View style={styles.pickerWrapper}>
        <Picker selectedValue={value} onValueChange={(v) => onChange(v)}>
          {districts.map((d) => (
            <Picker.Item label={d} value={d} key={d} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
  },
});

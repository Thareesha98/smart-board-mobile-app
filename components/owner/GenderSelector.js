import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GenderSelector({ value, onChange }) {
  const options = ["MALE", "FEMALE", "BOTH"];

  return (
    <View>
      <Text style={styles.label}>Gender Type</Text>

      <View style={styles.row}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, value === opt && styles.selected]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.text, value === opt && styles.textSel]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginVertical: 6 },
  row: { flexDirection: "row", gap: 10 },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },
  selected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  text: { color: "#000" },
  textSel: { color: "white", fontWeight: "bold" },
});

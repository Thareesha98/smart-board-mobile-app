import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BoardingTypeSelector({ value, onChange }) {
  const types = ["ROOM", "ANEX"];

  return (
    <View>
      <Text style={styles.label}>Boarding Type</Text>

      <View style={styles.row}>
        {types.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.option, value === t && styles.selected]}
            onPress={() => onChange(t)}
          >
            <Text style={[styles.text, value === t && styles.textSel]}>
              {t}
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
  selected: { backgroundColor: "#28a745", borderColor: "#28a745" },
  text: { color: "#000" },
  textSel: { color: "white", fontWeight: "bold" },
});

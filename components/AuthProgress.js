import { View, StyleSheet } from "react-native";

export default function AuthProgress({ step, total = 2 }) {
  return (
    <View style={styles.wrap}>
      {[...Array(total)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < step ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    height: 6,
    width: 40,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  active: { backgroundColor: "#38bdf8" },
  inactive: { backgroundColor: "#1e293b" },
});

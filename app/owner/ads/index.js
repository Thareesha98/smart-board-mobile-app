import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { AuthContext } from "../../../auth/AuthContext";
import api from "../../../client/api";
import { useRouter } from "expo-router";

export default function OwnerAdsList() {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadAds = async () => {
    try {
      const res = await api.get(`/owner/ads/${user.id}`);
      setAds(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAds();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderAd = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/owner/ads/edit/${item.id}`)}
    >
      <Image
        source={{ uri: item.imageUrls?.[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.price}>Rs. {item.pricePerMonth}</Text>

        <Text style={[styles.status,
          item.status === "APPROVED" ? styles.approved : styles.pending
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/owner/ads/create")}
      >
        <Text style={styles.addButtonText}>+ Add New Ad</Text>
      </TouchableOpacity>

      <FlatList
        data={ads}
        renderItem={renderAd}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  image: { width: 90, height: 90, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  address: { opacity: 0.7 },
  price: { marginTop: 5, color: "#007bff", fontWeight: "600" },
  status: { marginTop: 5, padding: 5, borderRadius: 6, textAlign: "center", width: 90 },
  approved: { backgroundColor: "#d4edda", color: "#155724" },
  pending: { backgroundColor: "#fff3cd", color: "#856404" },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButtonText: { textAlign: "center", color: "white", fontWeight: "bold" },
});

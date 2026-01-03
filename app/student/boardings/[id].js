import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../client/api";

const { width } = Dimensions.get("window");
const ACTION_BAR_HEIGHT = 96;

export default function BoardingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const carouselRef = useRef(null);

  useEffect(() => {
    loadBoarding();
  }, [id]);

  const loadBoarding = async () => {
    try {
      const res = await api.get(`/boardings/${id}`);
      setBoarding(res.data);
    } catch (error) {
      console.log("❌ Error loading boarding:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!boarding) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={{ color: "white" }}>Unable to load boarding.</Text>
      </SafeAreaView>
    );
  }

  const {
    title,
    description,
    address,
    pricePerMonth,
    keyMoney,
    imageUrls,
    genderType,
    boardingType,
    availableSlots,
    amenities,
    nearbyPlaces,
  } = boarding;

  const startChat = async () => {
  try {
    const res = await api.post("/chats", {
      boardingId: Number(id),
    });

    const { chatRoomId } = res.data;

    if (!chatRoomId) {
      throw new Error("Chat room ID missing");
    }

    router.push(`/chat/${chatRoomId}`);
  } catch (error) {
    console.log("❌ Failed to start chat:", error);
    Alert.alert(
      "Chat unavailable",
      "Unable to start conversation. Please try again."
    );
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: ACTION_BAR_HEIGHT + 24 }}
      >
        {/* IMAGE CAROUSEL */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) =>
            setActiveImage(
              Math.round(e.nativeEvent.contentOffset.x / width)
            )
          }
          ref={carouselRef}
        >
          {imageUrls?.map((url, idx) => (
            <Image key={idx} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>

        {/* DOTS */}
        <View style={styles.dotContainer}>
          {imageUrls?.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, activeImage === idx && styles.dotActive]}
            />
          ))}
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* TITLE + PRICE */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.priceBox}>
              <Text style={styles.price}>Rs {pricePerMonth}</Text>
              <Text style={styles.priceHint}>per month</Text>
              {keyMoney > 0 && (
                <Text style={styles.keyMoneySmall}>
                  Key money: Rs {keyMoney}
                </Text>
              )}
            </View>
          </View>

          <Text style={styles.address}>{address}</Text>

          <View style={styles.tagRow}>
            <Tag label={genderType} />
            <Tag label={boardingType} />
            <Tag label={`${availableSlots} slots`} />
          </View>

          {/* DESCRIPTION */}
          <SectionTitle label="Description" />
          <Text style={styles.description}>{description}</Text>

          {/* AMENITIES */}
          {amenities?.length > 0 && (
            <>
              <SectionTitle label="Amenities" />
              <View style={styles.chipWrapper}>
                {amenities.map((a, idx) => (
                  <Chip key={idx} label={a} />
                ))}
              </View>
            </>
          )}

          {/* NEARBY PLACES */}
          {nearbyPlaces && Object.keys(nearbyPlaces).length > 0 && (
            <>
              <SectionTitle label="Nearby Places" />
              <View style={styles.nearbyWrapper}>
                {Object.entries(nearbyPlaces).map(([place, km], idx) => (
                  <View key={idx} style={styles.nearbyItem}>
                    <Text style={styles.nearbyName}>{place}</Text>
                    <Text style={styles.nearbyDistance}>{km} km</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* 🔥 FINAL MODERN BOTTOM ACTION BAR */}
      <View style={styles.actionBar}>
        <ActionBtn icon="📞" label="Call" style={styles.callBtn} />

          <ActionBtn
            icon="💬"
            label="Message"
            style={styles.msgBtn}
            onPress={startChat}
          />


        <ActionBtn
          icon="📅"
          label="Visit"
          style={styles.visitBtn}
          onPress={() =>
            router.push(`/student/boardings/${id}/request-visit`)
          }
        />

        <ActionBtn
          icon="🏠"
          label="Book"
          style={styles.bookBtn}
          onPress={() =>
            router.push(`/student/boardings/${id}/register`)
          }
        />

        <ActionBtn
          icon="⚠️"
          label="Report"
          style={styles.reportBtn}
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= REUSABLE ================= */

function ActionBtn({ icon, label, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.actionBtn, style]}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Tag({ label }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function Chip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function SectionTitle({ label }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f172a" },

  loaderContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },

  image: { width, height: 260 },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 50,
    backgroundColor: "#475569",
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: "#3b82f6" },

  content: { padding: 16 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: { color: "white", fontSize: 22, fontWeight: "700", flex: 1 },

  priceBox: { alignItems: "flex-end" },
  price: { color: "#22c55e", fontSize: 20, fontWeight: "800" },
  priceHint: { color: "#94a3b8", fontSize: 12 },
  keyMoneySmall: { color: "#facc15", fontSize: 11, marginTop: 4 },

  address: { color: "#94a3b8", marginVertical: 6 },

  tagRow: { flexDirection: "row", gap: 8, marginVertical: 8 },

  tag: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: "white", fontSize: 12 },

  sectionTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },

  description: { color: "#cbd5e1", lineHeight: 20 },

  chipWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipText: { color: "white" },

  nearbyWrapper: { marginTop: 6 },
  nearbyItem: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  nearbyName: { color: "#f8fafc", fontWeight: "600" },
  nearbyDistance: { color: "#38bdf8" },

  /* 🔥 CLEAN MODERN ACTION BAR */
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ACTION_BAR_HEIGHT,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#020617f2",
    borderTopWidth: 1,
    borderColor: "#1e293b",
  },

  actionBtn: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  actionIcon: { fontSize: 18 },
  actionText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  callBtn: { backgroundColor: "#334155" },
  msgBtn: { backgroundColor: "#312e81" },
  visitBtn: { backgroundColor: "#2563eb" },
  bookBtn: { backgroundColor: "#16a34a" },
  reportBtn: { backgroundColor: "#991b1b" },
});

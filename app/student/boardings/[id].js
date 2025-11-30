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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../client/api";

const { width } = Dimensions.get("window");

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
    imageUrls,
    genderType,
    boardingType,
    availableSlots,
    maxOccupants,
    amenities,
    nearbyPlaces,
    boosted,
    boostEndDate,
  } = boarding;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        {/* 🔹 Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveImage(index);
          }}
          ref={carouselRef}
        >
          {imageUrls?.map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: url }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        {/* Carousel dots */}
        <View style={styles.dotContainer}>
          {imageUrls?.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                activeImage === idx && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>Rs {pricePerMonth}</Text>
          </View>

          <Text style={styles.address}>{address}</Text>

          <View style={styles.tagRow}>
            <Tag label={genderType} />
            <Tag label={boardingType} />
            <Tag label={`${availableSlots} slots`} />
            {maxOccupants ? <Tag label={`Max: ${maxOccupants}`} /> : null}
            {boosted ? <Tag label="Boosted" highlight /> : null}
          </View>

          {/* Description */}
          <SectionTitle label="Description" />
          <Text style={styles.description}>{description}</Text>

          {/* Amenities */}
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

          {/* Nearby Places */}
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

          {/* Buttons */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push(`/student/boardings/${id}/request-visit`)}
                >
                <Text style={styles.primaryButtonText}>Request Visit</Text>
                </TouchableOpacity>


            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Register / Book</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔹 Reusable Components */

function Tag({ label, highlight }) {
  return (
    <View style={[styles.tag, highlight && styles.tagHighlight]}>
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

/* 🎨 Styles */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Carousel */
  image: {
    width: width,
    height: 260,
  },
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
  dotActive: {
    backgroundColor: "#3b82f6",
  },

  /* Content */
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  price: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "700",
  },
  address: {
    color: "#94a3b8",
    fontSize: 14,
    marginVertical: 6,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  tag: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagHighlight: {
    backgroundColor: "#2563eb",
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },

  sectionTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },
  description: {
    color: "#cbd5e1",
    lineHeight: 20,
    fontSize: 14,
  },

  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipText: {
    color: "white",
    fontSize: 13,
  },

  nearbyWrapper: {
    marginTop: 6,
  },
  nearbyItem: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  nearbyName: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
  },
  nearbyDistance: {
    color: "#38bdf8",
    marginTop: 2,
  },

  buttonWrapper: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

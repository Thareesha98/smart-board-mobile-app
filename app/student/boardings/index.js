import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../../client/api"; // adjust path if needed

const GENDER_OPTIONS = ["ALL", "MALE", "FEMALE", "BOTH"];
const TYPE_OPTIONS = ["ALL", "ROOM", "ANEX"];

export default function StudentBoardingsScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [boardings, setBoardings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 🔎 Build backend query URL
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (genderFilter !== "ALL") params.append("genderType", genderFilter);
    if (typeFilter !== "ALL") params.append("boardingType", typeFilter);

    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    if (searchText) params.append("addressKeyword", searchText);

    params.append("page", page);
    params.append("size", 10);

    return params.toString();
  };

  // 🔥 Fetch boardings from backend
  const loadBoardings = async (reset = false) => {
    try {
      if (reset) {
        setPage(0);
        setBoardings([]);
      }

      if (loading || loadingMore) return;

      reset ? setLoading(true) : setLoadingMore(true);

      const query = buildQueryParams();
      const res = await api.get(`/boardings/search?${query}`);

      const data = res.data.content;
      const total = res.data.totalPages;

      if (reset) {
        setBoardings(data);
      } else {
        setBoardings((prev) => [...prev, ...data]);
      }

      setTotalPages(total);
    } catch (e) {
      console.log("❌ Error fetching boardings:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 🔄 Reload boardings when filters change
  useEffect(() => {
    loadBoardings(true);
  }, [searchText, genderFilter, typeFilter, minPrice, maxPrice]);

  // 🔄 Load more
  const loadMore = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
      loadBoardings(false);
    }
  };

  const handleCardPress = (id) => {
    router.push(`/student/boardings/${id}`);
  };

  const renderBoardingCard = ({ item }) => {
    const mainImage =
      item.imageUrls?.length > 0 ? { uri: item.imageUrls[0] } : null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item.id)}
        activeOpacity={0.85}
      >
        {mainImage ? (
          <Image source={mainImage} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.cardImagePlaceholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.cardAddress} numberOfLines={1}>
            {item.address}
          </Text>

          <Text style={styles.cardPrice}>Rs {item.pricePerMonth}</Text>

          <View style={styles.tagRow}>
            <Tag label={item.genderType} />
            <Tag label={item.boardingType} />
            <Tag label={`${item.availableSlots} slots`} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Find Boardings</Text>

        {/* 🔍 SEARCH */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or address..."
          placeholderTextColor="#6b7280"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* 🎚 FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
        >
          {/* Gender */}
          <FilterGroup
            label="Gender"
            options={GENDER_OPTIONS}
            selected={genderFilter}
            onSelect={setGenderFilter}
          />

          {/* Boarding Type */}
          <FilterGroup
            label="Type"
            options={TYPE_OPTIONS}
            selected={typeFilter}
            onSelect={setTypeFilter}
          />

          {/* Price filter */}
          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>Price (Rs)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                value={minPrice}
                onChangeText={setMinPrice}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>
          </View>
        </ScrollView>

        {/* 🔄 LOADING */}
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={boardings}
            renderItem={renderBoardingCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color="#3b82f6" style={{ marginVertical: 16 }} />
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// 🔹 Filter group
function FilterGroup({ label, options, selected, onSelect }) {
  return (
    <View style={styles.filterBlock}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.filterRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[styles.chip, selected === opt && styles.chipSelected]}
          >
            <Text
              style={[styles.chipText, selected === opt && styles.chipTextSelected]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Tag({ label }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: "700", color: "#f8fafc", marginBottom: 12 },
  searchInput: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
    color: "#f8fafc",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
  },
  filtersScroll: { marginBottom: 10 },
  filterBlock: { marginRight: 16 },
  filterLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 4 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
  },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 12 },
  chipTextSelected: { color: "white", fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceInput: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    color: "#e2e8f0",
    borderRadius: 8,
    width: 70,
    padding: 6,
    fontSize: 12,
  },
  priceSeparator: { color: "#94a3b8", marginHorizontal: 6 },
  card: {
    backgroundColor: "#020617",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  cardAddress: { color: "#94a3b8", fontSize: 13, marginTop: 2 },
  cardPrice: { color: "#22c55e", fontWeight: "700", marginTop: 6 },
  tagRow: { flexDirection: "row", marginTop: 8, gap: 6 },
  tag: {
    backgroundColor: "#1e293b",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: "#cbd5e1", fontSize: 11 },
});

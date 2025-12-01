import { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerComponent({ images, setImages, multiple = true }) {

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: multiple,
    });

    if (!result.canceled) {
      if (multiple) {
        const uris = result.assets.map(a => a.uri);
        setImages([...images, ...uris]);  
      } else {
        setImages([result.assets[0].uri]);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnTxt}>Pick Images</Text>
      </TouchableOpacity>

      <View style={styles.previewRow}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.preview} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});

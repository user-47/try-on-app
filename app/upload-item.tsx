import { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function UploadItem() {
  const router = useRouter();
  const { selfie } = useLocalSearchParams();
  const [item, setItem] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setItem(result.assets[0].uri);
    }
  };

  const goNext = () => {
    if (!item) return;
    router.push({
      pathname: "/generate",
      params: {
        selfie: selfie as string,
        item: item,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Outfit / Hair Style</Text>

      <Text style={styles.subtitle}>Your Selfie:</Text>
      <Image source={{ uri: selfie as string }} style={styles.smallImage} />

      {item && (
        <>
          <Text style={styles.subtitle}>Selected Item:</Text>
          <Image source={{ uri: item }} style={styles.largeImage} />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Item From Gallery</Text>
      </TouchableOpacity>

      {item && (
        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextButtonText}>Generate Try-On</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  smallImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  largeImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

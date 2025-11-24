import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function UploadSelfie() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const goNext = () => {
    if (!image) return;
    router.push({
      pathname: "/upload-item",
      params: { selfie: image },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Photo</Text>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  preview: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  button: {
    width: "80%",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
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

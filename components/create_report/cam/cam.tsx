// src/components/ImagePickerBox.tsx

import React, { useEffect } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  ImagePickerResult,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

type ImagePickerBoxProps = {
  label: string;
  imageUri: string | null;
  onImageSelected: (uri: string | null) => void;
};

const ImagePickerBox: React.FC<ImagePickerBoxProps> = ({
  label,
  imageUri,
  onImageSelected,
}) => {
  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const result: ImagePickerResult = await launchCameraAsync({
              mediaTypes: MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              onImageSelected(result.assets[0].uri);
            }
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result: ImagePickerResult = await launchImageLibraryAsync({
              mediaTypes: MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              onImageSelected(result.assets[0].uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    (async () => {
      const cameraStatus = await requestCameraPermissionsAsync();
      const mediaStatus = await requestMediaLibraryPermissionsAsync();
      if (
        cameraStatus.status !== "granted" ||
        mediaStatus.status !== "granted"
      ) {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and media library permissions."
        );
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>No Image Selected</Text>
          </View>
        )}
      </View>
      <Button mode="outlined" onPress={pickImage} style={styles.button}>
        {imageUri ? "Change Image" : "Select Image"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  button: {
    alignSelf: "center",
  },
});

export default ImagePickerBox;

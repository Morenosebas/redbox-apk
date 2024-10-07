// fields/ReportPhotos.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Button, Dialog, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { FormikErrors } from "formik";
import { ReportRequest } from "@/hooks/useCreateReport";

const ReportPhotos = ({
  setFieldValue,
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<ReportRequest>>;
}) => {
  const [photos, setPhotos] = useState<
    {
      uri: string;
      name: string;
      type: string;
      size?: number;
    }[]
  >([]);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const pickImage = async () => {
    // Solicita permisos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permiso para acceder a las fotos es requerido!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => {
        return {
          uri: asset.uri,
          name: asset.fileName?.split(".")[0] ?? " ",
          type: asset.type + "/" + asset.fileName?.split(".")[1] ?? "image",
          size: asset.fileSize ?? 0,
        };
      });
      setPhotos([...photos, ...selectedImages]);
    }
  };

  const deletePhoto = (uri: string) => {
    const updated = photos.filter((photo) => photo.uri !== uri);
    setPhotos(updated);
  };
  useEffect(() => {
    setFieldValue("REPORT_PHOTOS", photos);
  }, [photos]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PHOTOS OF THE REPORT</Text>
      <Button mode="contained" className="bg-blue-500" onPress={pickImage}>
        ADD PHOTOS
      </Button>

      <ScrollView horizontal style={styles.photoList}>
        {photos.map((phot, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri: phot.uri }} style={styles.photo} />
            <Button mode="text" onPress={() => deletePhoto(phot.uri)}>
              DELETE
            </Button>
          </View>
        ))}
      </ScrollView>

      {/* Opcional: Diálogo para ver las fotos en detalle */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>ATTACHMENTS</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {photos.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri: uri.uri }}
                  style={styles.fullPhoto}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>CLOSE</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  photoList: {
    maxHeight: 150,
  },
  photoItem: {
    marginRight: 8,
    alignItems: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  fullPhoto: {
    width: "100%",
    height: 300,
    marginBottom: 8,
  },
});

export default ReportPhotos;

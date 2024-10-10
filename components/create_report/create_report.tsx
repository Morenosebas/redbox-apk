// src/components/ReportForm.tsx

import React, { useState } from "react";
import { View, ScrollView, Alert, Image, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import ImagePickerBox from "./cam/cam";
import useGetOneSite from "@/hooks/useGetOneSite";
import { Dropdown } from "react-native-element-dropdown";
type ReportFormProps = {
  kioskIds: string[];
  technicians: string[];
  onSubmit: (data: ReportFormData) => void;
  isSubmiting: boolean;
};

export type ReportFormData = {
  KioskId: string;
  nota: string;
  name_tecnico: string;
  field: "none" | "already removed" | "done";
  PictBOX: string | null;
  PictBef: string | null;
  PictDef: string | null;
  PictAft: string | null;
};

const ReportForm: React.FC<ReportFormProps> = ({
  kioskIds,
  technicians,
  onSubmit,
  isSubmiting,
}) => {
  const [KioskId, setKioskId] = useState("");
  const [nota, setNota] = useState("");
  const [name_tecnico, setNameTecnico] = useState("");
  const [field, setField] = useState<"none" | "already removed" | "done">(
    "none"
  );
  const { site, loading } = useGetOneSite(KioskId);
  const [images, setImages] = useState<{
    PictBOX: string | null;
    PictBef: string | null;
    PictDef: string | null;
    PictAft: string | null;
  }>({
    PictBOX: null,
    PictBef: null,
    PictDef: null,
    PictAft: null,
  });

  const [selected, setSelected] = useState<{ label: string; value: string }>();

  const handleImageSelected = (
    field: keyof typeof images,
    uri: string | null
  ) => {
    setImages((prevImages) => ({
      ...prevImages,
      [field]: uri,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields if necessary
    if (!KioskId || !name_tecnico) {
      Alert.alert("Error", "Please select a Kiosk ID and Technician.");
      return;
    }

    const reportData: ReportFormData = {
      KioskId,
      nota,
      name_tecnico,
      field,
      PictBOX: images.PictBOX,
      PictBef: images.PictBef,
      PictDef: images.PictDef,
      PictAft: images.PictAft,
    };
    onSubmit(reportData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Kiosk ID Picker */}
        <View>
          <Text style={styles.label}>Store number</Text>
          <Text>{site?.store_id}</Text>
        </View>
        <View>
          <Text>{site?.ParentName}</Text>
        </View>
        <View>
          <Text style={styles.label}>Address</Text>
          <Text>
            {site?.address +
              " " +
              site?.city +
              " " +
              site?.state +
              " " +
              site?.zip_code}
          </Text>
        </View>
        {/* <Picker
          selectedValue={KioskId}
          onValueChange={(itemValue) => setKioskId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Kiosk ID" value="" />
          {kioskIds.map((id) => (
            <Picker.Item label={id} value={id} key={id} />
          ))}
        </Picker> */}
        <Dropdown
          style={{
            height: 50,
            backgroundColor: "#fff",
            borderRadius: 4,
            marginBottom: 16,
            marginTop: 16,
          }}
          data={kioskIds.map((id) => ({ label: id, value: id }))}
          value={selected?.value}
          onChange={(value) => {
            setSelected(value);
            setKioskId(value.label);
          }}
          search
          renderItem={(item) => (
            <View
              className={`p-2 border-b ${
                selected?.label == item.label ? "bg-orange-400" : ""
              }`}
            >
              <Text className="text-center">{item.value}</Text>
            </View>
          )}
          searchField="value"
          placeholder={selected?.value}
          labelField="value"
          valueField="label"
          inputSearchStyle={{
            height: 50,
          }}
        />
        {/* Note TextInput */}
        <TextInput
          label="Note"
          value={nota}
          onChangeText={setNota}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        {/* Technician Picker */}
        <Text style={styles.label}>Select Technician</Text>
        <Picker
          selectedValue={name_tecnico}
          onValueChange={(itemValue) => setNameTecnico(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Technician" value="" />
          {technicians.map((tech) => (
            <Picker.Item label={tech} value={tech} key={tech} />
          ))}
        </Picker>
        {/* Field Status Picker */}
        <Text style={styles.label}>Select Field Status</Text>
        <Picker
          selectedValue={field}
          onValueChange={(itemValue) => setField(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="None" value="" />
          <Picker.Item label="Already Removed" value="already removed" />
          <Picker.Item label="Done" value="done" />
        </Picker>
        {/* Image Pickers */}
        <ImagePickerBox
          label="Equipment"
          imageUri={images.PictBOX}
          onImageSelected={(uri) => handleImageSelected("PictBOX", uri)}
        />
        <ImagePickerBox
          label="Connections"
          imageUri={images.PictBef}
          onImageSelected={(uri) => handleImageSelected("PictBef", uri)}
        />
        <ImagePickerBox
          label="Disconnected"
          imageUri={images.PictDef}
          onImageSelected={(uri) => handleImageSelected("PictDef", uri)}
        />
        <ImagePickerBox
          label="Front Store"
          imageUri={images.PictAft}
          onImageSelected={(uri) => handleImageSelected("PictAft", uri)}
        />
        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={isSubmiting}
          className="disabled:bg-gray-500"
        >
          Submit Report
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    padding: 8,
  },
});

export default ReportForm;

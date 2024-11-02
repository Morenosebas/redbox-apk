// src/components/EditReportForm.tsx

import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import ImagePickerBox from "../create_report/cam/cam";
import { Picker } from "@react-native-picker/picker";

type EditReportFormProps = {
  reportId: string;
  kioskIds: string[];
  technicians: string[];
  onSubmit: (id: string, data: ReportFormData) => void;
  onCancel: () => void;
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

const EditReportForm: React.FC<EditReportFormProps> = ({
  reportId,
  kioskIds,
  technicians,
  onSubmit,
  onCancel,
}) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportFormData | null>(null);

  // State for form fields
  const [KioskId, setKioskId] = useState("");
  const [nota, setNota] = useState("");
  const [name_tecnico, setNameTecnico] = useState("");
  const [field, setField] = useState<"none" | "already removed" | "done">(
    "none"
  );
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

  // Fetch the existing report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Replace with your actual data fetching logic
        const response = await fetch(
          `https://your-backend-api.com/reportes/${reportId}`
        );
        if (response.ok) {
          const data = await response.json();
          setReportData(data);
          // Initialize form fields with fetched data
          setKioskId(data.KioskId);
          setNota(data.nota);
          setNameTecnico(data.name_tecnico);
          setField(data.field || "none");
          setImages({
            PictBOX: data.PictBOX || null,
            PictBef: data.PictBef || null,
            PictDef: data.PictDef || null,
            PictAft: data.PictAft || null,
          });
        } else {
          Alert.alert("Error", "Failed to fetch report data.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportId]);

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
      Alert.alert("Error", "Please ensure all required fields are filled.");
      return;
    }

    const updatedData: ReportFormData = {
      KioskId,
      nota,
      name_tecnico,
      field,
      PictBOX: images.PictBOX,
      PictBef: images.PictBef,
      PictDef: images.PictDef,
      PictAft: images.PictAft,
    };

    onSubmit(reportId, updatedData);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading report data...</Text>
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load report data.</Text>
        <Button onPress={onCancel}>Go Back</Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Kiosk ID Display */}
        <TextInput
          label="Kiosk ID"
          value={KioskId}
          disabled
          mode="outlined"
          style={styles.input}
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
        <View style={styles.fieldStatusContainer}>
          <Button
            mode={field === "none" ? "contained" : "outlined"}
            onPress={() => setField("none")}
            style={styles.fieldButton}
          >
            None
          </Button>
          <Button
            mode={field === "already removed" ? "contained" : "outlined"}
            onPress={() => setField("already removed")}
            style={styles.fieldButton}
          >
            Already Removed
          </Button>
          <Button
            mode={field === "done" ? "contained" : "outlined"}
            onPress={() => setField("done")}
            style={styles.fieldButton}
          >
            Done
          </Button>
        </View>

        {/* Image Pickers */}
        <ImagePickerBox
          label="PictBOX Image"
          imageUri={images.PictBOX}
          onImageSelected={(uri) => handleImageSelected("PictBOX", uri)}
        />
        <ImagePickerBox
          label="PictBef Image"
          imageUri={images.PictBef}
          onImageSelected={(uri) => handleImageSelected("PictBef", uri)}
        />
        <ImagePickerBox
          label="PictDef Image"
          imageUri={images.PictDef}
          onImageSelected={(uri) => handleImageSelected("PictDef", uri)}
        />
        <ImagePickerBox
          label="PictAft Image"
          imageUri={images.PictAft}
          onImageSelected={(uri) => handleImageSelected("PictAft", uri)}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            Update Report
          </Button>
          <Button mode="text" onPress={onCancel} style={styles.cancelButton}>
            Cancel
          </Button>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    marginBottom: 16,
  },
  fieldStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fieldButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    padding: 8,
    marginBottom: 8,
  },
  cancelButton: {
    padding: 8,
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});

export default EditReportForm;

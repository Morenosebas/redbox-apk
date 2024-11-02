// src/screens/EditReportScreen.tsx

import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import EditReportForm, { ReportFormData } from "@/components/edit_report/edit";

const EditReportScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { reportId } = route.params;
  // Inside EditReportForm.tsx

  // Add a state to store original images
  const [originalImages, setOriginalImages] = useState<{
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

  // Sample data; replace with your actual data fetching logic
  const technicians = ["John Doe", "Jane Smith", "Bob Johnson"]; // Replace with actual data

  const handleReportUpdate = async (id: string, data: ReportFormData) => {
    try {
      const formData = new FormData();

      // Append text fields if they have changed
      formData.append("nota", data.nota);
      formData.append("name_tecnico", data.name_tecnico);
      formData.append("field", data.field);

      // Append images if they have been changed (you might need to track which images have changed)
      if (data.PictBOX && data.PictBOX !== originalImages.PictBOX) {
        formData.append("PictBOX", {
          uri: data.PictBOX,
          name: "pictbox.jpg",
          type: "image/jpeg",
        } as any);
      }
      // Repeat for other images...

      const response = await fetch(
        `https://your-backend-api.com/actualizar_reporte/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        Alert.alert("Success", "Report updated successfully!");
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <EditReportForm
        reportId={reportId}
        kioskIds={[]} // Not needed since KioskId is disabled
        technicians={technicians}
        onSubmit={handleReportUpdate}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default EditReportScreen;

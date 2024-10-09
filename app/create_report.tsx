// src/screens/CreateReportScreen.tsx

import React, { useState } from "react";
import { View, Alert } from "react-native";
import ReportForm, {
  ReportFormData,
} from "@/components/create_report/create_report";
import AXIOS from "@/axios/config";
import useGetKioskIds from "@/hooks/useGetKioskIds";
import useGettecnicos from "@/hooks/useGetTecnicos";

const CreateReportScreen: React.FC = () => {
  // Sample data; replace with your actual data fetching logic
  const [KioskId, setKioskId] = useState("");
  const { kioskIds, loading } = useGetKioskIds();
  const { tecnicos, loading: loadTec } = useGettecnicos();

  const handleReportSubmit = async (data: ReportFormData) => {
    try {
      const formData = new FormData();
      formData.append("KioskId", data.KioskId);
      formData.append("nota", data.nota);
      formData.append("name_tecnico", data.name_tecnico);
      formData.append("field", data.field);
      const fechaActual = new Date();
      const fechaISO = new Date(fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      formData.append("fecha", fechaISO);
      if (data.PictBOX) {
        formData.append("PictBOX", {
          uri: data.PictBOX,
          name: "pictbox.jpeg",
          type: "image/jpeg",
        } as any);
      }
      if (data.PictBef) {
        formData.append("PictBef", {
          uri: data.PictBef,
          name: "pictbef.jpeg",
          type: "image/jpeg",
        } as any);
      }
      if (data.PictDef) {
        formData.append("PictDef", {
          uri: data.PictDef,
          name: "pictdef.jpeg",
          type: "image/jpeg",
        } as any);
      }
      if (data.PictAft) {
        formData.append("PictAft", {
          uri: data.PictAft,
          name: "pictaft.jpeg",
          type: "image/jpeg",
        } as any);
      }
      const baseUrl = AXIOS.defaults.baseURL;
      const response = await fetch(baseUrl + "/insertar_reportes", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        Alert.alert("Success", "Report submitted successfully!");
        // Optionally, reset the form or navigate away
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ReportForm
        kioskIds={kioskIds}
        technicians={tecnicos}
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default CreateReportScreen;

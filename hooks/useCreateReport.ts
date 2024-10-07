import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import AXIOS from "@/axios/config";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface ReportFormData {
  Report: ReportRequest; // JSON stringified ReportINTERFACE
}

export interface ReportRequest {
  PROJECT_ID: string;
  ATTENDANCE: {
    _id: string;
    NAME: string;
    POSITION: string;
  }[];
  MATERIAL: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  NOTES: {
    category: string;
    note: string;
    ATTACHMENTS: {
      uri: string;
      name: string;
      type: string;
    }[];
  }[];
  DATE: string;
  SITE_HEALTH: string;
  STATE: string;
  REPORT_PHOTOS: {
    uri: string;
    name: string;
    type: string;
    size?: number;
  }[];
}

export function useCreateReport(projectId: string) {
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);
  const mutation = useMutation({
    mutationFn: async (variables: ReportRequest) => {
      const formData = new FormData();
      formData.append("DATE", variables.DATE);
      formData.append("SITE_HEALTH", variables.SITE_HEALTH);
      formData.append("STATE", variables.STATE);
      formData.append("PROJECT_ID", projectId);
      variables.ATTENDANCE.forEach((attendance) => {
        formData.append("ATTENDANCE", JSON.stringify(attendance));
      });
      variables.MATERIAL.forEach((material) => {
        formData.append("MATERIAL", JSON.stringify(material));
      });

      for (let index = 0; index < variables.NOTES.length; index++) {
        const note = variables.NOTES[index];
        formData.append("NOTES", JSON.stringify(note));
        for (let ind = 0; ind < note.ATTACHMENTS.length; ind++) {
          const attachment = note.ATTACHMENTS[ind];
          const date = Date.now().toString();
          if (attachment.type.includes("image")) {
            formData.append("ATTACHMENTS-" + index, {
              uri: attachment.uri,
              name: "ATTACHMENTS-" + date + "-" + ind,
              type: "image/*",
            } as any);
          } else {
            formData.append("ATTACHMENTS-" + index, {
              uri: attachment.uri,
              name: "ATTACHMENTS-" + date + "-" + ind,
              type: "application/pdf",
            } as any);
          }
        }
      }

      for (let index = 0; index < variables.REPORT_PHOTOS.length; index++) {
        const photo = variables.REPORT_PHOTOS[index];
        const date = Date.now().toString();
        const name =
          "REPORT_PHOTOS-" + date + "-" + index + photo.uri.split("/").pop();
        console.log("photo", name);
        formData.append("REPORT_PHOTOS", {
          uri: photo.uri,
          name: name,
          type: photo.type,
        } as any);
      }

      try {
        // const response = await AXIOS.post(`reports/create`, formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //     Accept: "application/json",
        //   },
        //   transformRequest: (data, headers) => {
        //     return data;
        //   },
        // });
        const token = await AsyncStorage.getItem("authToken");
        const response = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "https://6f3906702b06.sn.mynetname.net/api/reports/create/mobile"
          );

          // Añade el token de autenticación si es necesario
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }

          // Manejo de la respuesta
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.response));
            } else {
              reject(
                new Error(
                  xhr.responseText || `Request failed with status ${xhr.status}`
                )
              );
            }
          };

          // Manejo de errores
          xhr.onerror = () => {
            reject(new Error("Network Error"));
          };

          // Opcional: seguimiento del progreso de subida
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              console.log(`Upload Progress: ${progress}%`);
              // Puedes actualizar el estado para mostrar el progreso en la interfaz de usuario
            }
          };

          // Envío del formulario
          xhr.send(formData);
        });

        setCurrentStatus(200);
        return response;
      } catch (error) {
        console.log("error", error);
      }
    },
  });
  const formik = useFormik<ReportRequest>({
    initialValues: {
      DATE: new Date().toISOString().split("T")[0],
      SITE_HEALTH: "OK",
      STATE: "IN PROGRESS",
      ATTENDANCE: [],
      MATERIAL: [],
      NOTES: [],
      PROJECT_ID: projectId,
      REPORT_PHOTOS: [],
    },

    onSubmit: async (values) => {
      try {
        const response = await mutation.mutateAsync(values);
        // if (response?.status !== 200) {
        //   Toast.success("Report created successfully", "top");
        //   throw new Error(response?.data.message);
        // }
        console.log("response", response);
        if (!response) throw new Error("No response from server");
        return response;
      } catch (e) {
        if (e instanceof AxiosError) {
          setCurrentStatus(Number(e.response?.status));
          Toast.error(e?.response?.data.message, "top");
        } else if (e instanceof Error) {
          setCurrentStatus(500);
          Toast.error(e.message, "top");
        }
      }
    },
  });
  const {
    handleSubmit,
    isSubmitting,
    handleChange,
    values,
    setFieldValue,
    resetForm,
  } = formik;
  const [toasId, setToastID] = useState<string | number | null>();
  useEffect(() => {
    if (isSubmitting) {
      Toast.info("Creating project...", "top");
    } else if (toasId) {
    }
  }, [isSubmitting]);

  return {
    handleSubmit,
    isSubmitting,
    handleChange,
    values,
    setFieldValue,
    resetForm,
    setCurrentStatus,
    currentStatus,
  };
}

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import AXIOS from "@/axios/config";
import { Toast } from "toastify-react-native";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PROJECTINTERFACE } from "./useGetOneProject";
export interface ProjectFormData {
  project: ProjectRequest; // JSON stringified PROJECTINTERFACE
  CLIENT_LOGO?: File | string;
  CONTRACTING_LOGO?: File | string;
}

export interface ProjectRequest {
  ADDRESS: string;
  PROJECT_NAME: string;
  BUDGET: {
    ESTIMATED: number;
    ACTUAL: number;
    NAME: string;
    UNIT: string;
  }[];
  ESTIMATED_END_DATE: string;
  START_DATE: string;
  PROJECT_MANAGER: string;
  SITE_HEALTH: "NOT STARTED" | "NEED ATTENTION" | "OK" | "FINISHED";
  STATE: string;
  STAFF: string[];
  PM_ID: string;
}

export function useModifyProject(
  project: Omit<PROJECTINTERFACE, "STAFF"> & {
    PROJECT_MANAGER: { _id: string; FULL_NAME: string };
    STAFF: {
      _id: string;
      FULL_NAME: string;
      POSITION: string;
    }[];
  },
  onEdit: boolean
) {
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);
  const mutation = useMutation({
    mutationFn: async (
      variables: ProjectRequest & Omit<ProjectFormData, "project">
    ) => {
      if (!project) throw new Error("Project not found");
      const formData = new FormData();
      formData.append("project", JSON.stringify(variables));
      try {
        const response = await AXIOS.put(
          "/projects/" + project._id + "/modify",
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCurrentStatus(200);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  });
  const formik = useFormik<
    ProjectRequest & Omit<ProjectFormData, "project"> & { PM_ID: string }
  >({
    initialValues: {
      ADDRESS: project?.ADDRESS || "",
      PROJECT_NAME: project?.PROJECT_NAME || "",
      BUDGET: project?.BUDGET || [],
      ESTIMATED_END_DATE: String(project?.ESTIMATED_END_DATE) || "",
      START_DATE: String(project?.START_DATE) || "",
      PROJECT_MANAGER: String(project?.PROJECT_MANAGER._id) || "",
      SITE_HEALTH: project?.SITE_HEALTH || "",
      STATE: project?.STATE || "",
      STAFF: project?.STAFF?.map((staff) => staff._id.toString()) || [],
      PM_ID: String(project?.PROJECT_MANAGER._id) || "",
    },

    onSubmit: async (values) => {
      try {
        const response = await mutation.mutateAsync(values);
        Toast.success("Project modified successfully", "top");

        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        return response;
      } catch (e) {
        if (e instanceof AxiosError) {
          setCurrentStatus(Number(e.response?.status));
          Toast.error(e.response?.data.message, "top");
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
    submitForm,
  } = formik;

  useEffect(() => {
    if (currentStatus === 200) {
      Toast.success("Project modified successfully", "top");
    } else if (currentStatus === 500) {
      Toast.error("An error occurred", "top");
    }
    () => {};
  }, [currentStatus]);
  useEffect(() => {
    if (currentStatus === 200) {
      setCurrentStatus(null);
    }
    if (!isSubmitting) {
      setCurrentStatus(null);
    }

    return () => {
      setCurrentStatus(null);
    };
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
    submitForm,
  };
}

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import AXIOS from "@/axios/config";
import { Toast } from "toastify-react-native";
import { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function useLogIn() {
  const mutation = useMutation({
    mutationFn: async (variables: { USERNAME: string; PASSWORD: string }) => {
      try {
        console.log(AXIOS.defaults.baseURL);
        const response = await AXIOS.post("/auth/signin", {
          USERNAME: variables.USERNAME,
          PASSWORD: variables.PASSWORD,
          bandMob: true,
        });
        if (response && "data" in response && response.data.token) {
          await AsyncStorage.setItem("authToken", response.data.token);
          // Toast.success("Successful login", "top");
          return response.data;
        } else if (response.data) {
          Toast.error("Error logging " + response.data.message, "top");
          return response.data;
        } else {
          Toast.error("Error logging " + response.data.message, "top");
          return response.data;
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          Toast.error("Error logging " + error?.response?.data.message, "top");
          console.log(error.response?.data);
        }
      }
    },
  });

  const { values, isSubmitting, handleChange, handleSubmit, submitForm } =
    useFormik({
      initialValues: {
        USERNAME: "",
        PASSWORD: "",
      },
      onSubmit: async (values) => {
        try {
          const response = await mutation.mutateAsync(values);
        } catch (error) {
          Toast.error("Error logging in", "top");
        }
      },
    });
  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
    submitForm,
    isSuccess: mutation.isSuccess,
  };
}

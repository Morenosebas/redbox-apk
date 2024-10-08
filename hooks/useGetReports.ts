"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/axios/config";
import { Toast } from "toastify-react-native";

export interface REPORTINTERFACE {
  KioskId: string;
  fecha: string;
  nota: string;
  name_tecnico: string;
  code: number;
  store_id: string;
  address: string;
  _id: string;
}

export default function useGetReports() {
  const [reports, setReports] = useState<REPORTINTERFACE[]>([]);

  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await AXIOS.get<REPORTINTERFACE[]>("/reportes", {
        params: {},
      });
      return response;
    },
  });
  useEffect(() => {
    if (response) {
      setReports(response.data);
    }
    if (error) {
      Toast.error(error.message, "top");
    }
  }, [response, error]);
  return { reports, isLoading, error, refetchReports: refetch };
}

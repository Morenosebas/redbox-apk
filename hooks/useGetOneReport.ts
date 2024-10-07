import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/axios/config";
import { AxiosResponse } from "axios";

export interface REPORTINTERFACE {
  _id?: string;
  DATE: Date | string;
  BLOCK: Boolean;
  // ESTIMATED_TIME: Date;
  SITE_HEALTH: "NOT STARTED" | "NEED ATTENTION" | "OK" | "FINISHED";
  STATE: "NOT STARTED" | "IN PROGRESS" | "FINISHED" | "STOPPED";
  NOTES: NOTES[];
  ATTENDANCE: ATTENDANCE[];
  PROJECT: string;
  MATERIALS: MATERIALS[];
  createdAt: Date;
  REPORT_PHOTOS: string[];
  REPORT_STATUS:
    | "Under review by Leader"
    | "Confirmed by the Leader"
    | "Under review by ADMIN"
    | "Confirmed by ADMIN";
  UPDATES: UPDATES[];
}
interface ATTENDANCE {
  _id?: string;
  NAME: string;
  POSITION?: string;
}

interface ATTACHMENTS {
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  src: string;
}

interface NOTES {
  note: string;
  category: string;
  ATTACHMENTS: ATTACHMENTS[];
  _id: string;
}

interface MATERIALS {
  name: string;
  quantity: number;
  unit: string;
}

interface UPDATES {
  DATE: Date;
  _id: string;
}

export default function useGetOneReport(ReportId: string | null | undefined) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Report", ReportId],
    queryFn: async () => {
      if (!ReportId) return;
      const {
        data,
        status,
      }: AxiosResponse<
        Omit<REPORTINTERFACE, "ATTENDANCE" | "DATE" | "UPDATES"> & {
          ATTENDANCE: {
            _id: string;
            NAME: string;
            POSITION?: string;
          }[];
          DATE: string;
          UPDATES: {
            _id: string;
            DATE: Date;
            NAME: string;
          }[];
        }
      > = await AXIOS.get(`/reports/${ReportId}`);
      return data;
    },
  });

  return { report: data, isLoading, refetch };
}

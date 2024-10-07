"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/axios/config";
import { Toast } from "toastify-react-native";

export interface GetProjectsProps {
  FilterValuesState:
    | "NONE"
    | "NOT STARTED"
    | "IN PROGRESS"
    | "FINISHED"
    | "STOPPED";
  FilterValuesSiteHealth:
    | "NONE"
    | "NOT STARTED"
    | "NEED ATTENTION"
    | "OK"
    | "FINISHED";
  orderBy: string;
  limit: number;
  START_DATE?: string;
  END_DATE?: string;
  currentPage: number;
  search: string;
  sort: string;
}

export interface PAGINATIONINTERFACE {
  total: number;
  page: number;
  pages: number;
  next: number | null;
  prev: number | null;
  hasNext: boolean;
  hasPrev: boolean;
}

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

export default function useGetReports({
  FilterValuesState,
  FilterValuesSiteHealth,
  orderBy,
  limit,
  search,
  sort,
  currentPage,
  projectId,
  END_DATE,
  START_DATE,
}: GetProjectsProps & { projectId?: string }) {
  const [reports, setReports] = useState<
    (REPORTINTERFACE & {
      PROJECT_NUMBER: string;
      PROJECT_NAME: string;
      PROJECT_MANAGER: string;
    })[]
  >([]);
  const [pagination, setPagination] = useState<PAGINATIONINTERFACE>({
    hasNext: false,
    hasPrev: false,
    next: 0,
    page: 0,
    pages: 0,
    prev: 0,
    total: 0,
  });
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "reports",
      {
        FilterValuesState,
        FilterValuesSiteHealth,
        orderBy,
        limit,
        currentPage,
        search,
        sort,
        projectId,
        START_DATE,
        END_DATE,
      },
    ],
    queryFn: async () => {
      const response = await AXIOS.get("/reports", {
        params: {
          FilterValuesState,
          FilterValuesSiteHealth,
          orderBy,
          limit,
          currentPage,
          search,
          sort,
          projectId,
          START_DATE,
          END_DATE,
        },
      });
      return response;
    },
  });
  useEffect(() => {
    if (response) {
      setReports(response.data?.reports);
      setPagination(response.data?.pagination);
    }
    if (error) {
      Toast.error(error.message, "top");
    }
  }, [
    response,
    FilterValuesState,
    orderBy,
    limit,
    currentPage,
    error,
    search,
    sort,
    FilterValuesSiteHealth,
  ]);
  return { reports, isLoading, error, pagination, refetchReports: refetch };
}

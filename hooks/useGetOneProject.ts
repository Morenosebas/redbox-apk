import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/axios/config";
import { AxiosResponse } from "axios";

export interface PROJECTINTERFACE {
  _id?: string;
  LOGOS: {
    CLIENT_LOGO?: string;
    CONTRACTING_LOGO?: string;
  };
  PROJECT_NAME: string;
  PROJECT_NUMBER?: number;
  ADDRESS: string;
  PROJECT_MANAGER: string;
  START_DATE: Date;
  ESTIMATED_END_DATE: Date;
  END_DATE?: Date | null;
  SITE_HEALTH: "NOT STARTED" | "NEED ATTENTION" | "OK" | "FINISHED";
  STATE: "NOT STARTED" | "IN PROGRESS" | "FINISHED" | "STOPPED";
  STAFF: string[];
  BUDGET: {
    ESTIMATED: number;
    ACTUAL: number;
    UNIT: string;
    NAME: string;
  }[];
}

export default function useGetOneProject(projectId: string | null | undefined) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return;
      const {
        data,
        status,
      }: AxiosResponse<{
        project: Omit<PROJECTINTERFACE, "STAFF"> & {
          PROJECT_MANAGER: {
            _id: string;
            FULL_NAME: string;
            POSITION: string;
          };
          STAFF: {
            _id: string;
            FULL_NAME: string;
            POSITION: string;
          }[];
        };
      }> = await AXIOS.get(`/projects/${projectId}`);
      return data;
    },
  });

  return { project: data, isLoading, refetch };
}

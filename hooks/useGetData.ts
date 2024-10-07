import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import AXIOS from "@/axios/config";
import { PAGINATIONINTERFACE } from "./useGetReports";
export default function useGetData(
  typeData: "Materials" | "Staff",
  search: string,
  currentPage?: number,
  unpaginated?: boolean
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [typeData, search, currentPage],
    queryFn: async () => {
      const response = await AXIOS.get(
        `/${typeData.toLowerCase()}?search=${search}&currentPage=${currentPage}&unpaginated=${
          unpaginated ?? false
        }`
      );
      if (typeData === "Materials") {
        return response.data as {
          materials: { _id: string; name: string }[];
          pagination: PAGINATIONINTERFACE;
        };
      } else if (typeData === "Staff") {
        return response.data as {
          users: {
            _id: string;
            NAME: string;
            POSITION: string;
          }[];
          pagination: PAGINATIONINTERFACE;
        };
      }
    },
  });
  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);
  return { data, isLoading, refetch };
}

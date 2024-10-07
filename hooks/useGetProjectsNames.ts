import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/axios/config";

export default function useGetProjectsNames(value: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", value],
    queryFn: async () => {
      const { data } = await AXIOS.get<{
        projects: {
          _id: string;
          PROJECT_NAME: string;
          ADDRESS: string;
        }[];
      }>("/projects/names");
      return data;
    },
  });
  return { data, isLoading };
}

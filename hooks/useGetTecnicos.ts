import AXIOS from "@/axios/config";
import formik from "formik";
import { useEffect, useState } from "react";

export default function useGettecnicos() {
  const [tecnicos, settecnicos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AXIOS.get(`/tecnicos`);
        settecnicos(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kiosk ids", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tecnicos, loading, error };
}

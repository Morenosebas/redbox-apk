import AXIOS from "@/axios/config";
import { useEffect, useState } from "react";

export default function useGetKioskIds() {
  const [kioskIds, setKioskIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AXIOS.get(`/kiosks`);
        setKioskIds(response.data.kiosks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kiosk ids", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { kioskIds, loading, error };
}

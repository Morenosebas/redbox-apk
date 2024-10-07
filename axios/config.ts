import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AXIOS = axios.create({
  baseURL: process.env.SERVER_ROUTE || "http://192.168.1.11:3000/api",
  // baseURL: "https://6f3906702b06.sn.mynetname.net/api",
});

AXIOS.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AXIOS;

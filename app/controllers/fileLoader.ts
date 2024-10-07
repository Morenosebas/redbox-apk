import AXIOS from "@/axios/config";

interface Props {
  src: string;
}

export default function customFileLoader({ src }: Props) {
  try {
    const encode = encodeURIComponent(btoa(src));
    const baseURL = AXIOS.defaults.baseURL;
    return baseURL + "/loader/files?src=" + encode;
  } catch (error) {
    console.error("Error encoding file URL:", error);
    return src; // Devolver la URL original en caso de error
  }
}

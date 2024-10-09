import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toast } from "toastify-react-native";
// import JWT from "expo-jwt";
import { jwtDecode } from "jwt-decode";
interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => new Promise(() => {}),
  logout: () => {},
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const loadToken = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token) as {
          id: string;
          ROLE: string;
          POSITION: string;
        };
        console.log("token", token);
        setIsAuthenticated(true);
        Toast.success("Session loaded successfully", "top");
      } else {
        setIsAuthenticated(false);
        // Toast.error("Session not loaded", "top");
      }
    } catch (error) {
      setIsAuthenticated(false);
      Toast.error("Login error", "top");
      console.error("Error al cargar el token", error);
    } finally {
      setLoading(false);
    }
  };
  const pathName = usePathname();
  useEffect(() => {
    if (!isAuthenticated) {
      if (pathName !== "/") router.replace("/");
    } else if (isAuthenticated) {
      if (pathName === "/") {
        router.replace("/home");
      }
    }
  }, [isAuthenticated]);
  const login = async () => {
    await loadToken();
  };
  useEffect(() => {
    loadToken();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsAuthenticated(false);
      Toast.success("Session closed successfully", "top");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      Toast.error("Logout error", "top");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

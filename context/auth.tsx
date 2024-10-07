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
import { PROJECTINTERFACE } from "@/hooks/useGetOneProject";
interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  project: PROJECTINTERFACE;
}
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => new Promise(() => {}),
  logout: () => {},
  loading: false,
  project: {
    ADDRESS: "",
    BUDGET: [],
    ESTIMATED_END_DATE: new Date(),
    PROJECT_MANAGER: "",
    PROJECT_NAME: "",
    SITE_HEALTH: "NOT STARTED",
    START_DATE: new Date(),
    STATE: "NOT STARTED",
    STAFF: [],
    LOGOS: {},
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<PROJECTINTERFACE>({
    ADDRESS: "",
    BUDGET: [],
    ESTIMATED_END_DATE: new Date(),
    PROJECT_MANAGER: "",
    PROJECT_NAME: "",
    SITE_HEALTH: "NOT STARTED",
    START_DATE: new Date(),
    STATE: "NOT STARTED",
    STAFF: [],
    LOGOS: {},
  });
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
          project: PROJECTINTERFACE;
        };
        console.log("token", token);
        setProject(decoded.project);
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
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, project }}
    >
      {children}
    </AuthContext.Provider>
  );
};

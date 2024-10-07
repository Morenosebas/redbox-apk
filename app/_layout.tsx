import { useFonts } from "expo-font";
import { Slot, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect } from "react";
import "react-native-reanimated";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastManager from "toastify-react-native";
import { AuthProvider } from "@/context/auth";
import 'expo-dev-client';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
        <ToastManager
          duration={5000}
          style={{
            borderRadius: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
          textStyle={{ color: "white", fontSize: 10 }}
        />
        <PaperProvider theme={DefaultTheme}>
          <Stack>{children}</Stack>
        </PaperProvider>
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </AuthProvider>
  );
}

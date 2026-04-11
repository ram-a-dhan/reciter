import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { darkTheme, lightTheme } from "@/constants/theme";

export default function RootLayout () {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  NavigationBar.setStyle(colorScheme === "dark" ? "dark" : "light");

  return (
    <>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaProvider>
      </PaperProvider>
    </>
  );
}

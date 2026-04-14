import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { useLayoutEffect, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import * as StatusBar from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const { selectedTheme } = useThemeStore();

  const systemScheme = colorScheme ?? "light";

  const resolvedScheme = selectedTheme.value === "auto"
    ? systemScheme
    : selectedTheme.value;

  const paperTheme = useMemo(() => {
    return resolvedScheme === "dark" ? darkTheme : lightTheme;
  }, [resolvedScheme]);

  useLayoutEffect(() => {
    StatusBar.setStatusBarStyle(resolvedScheme);
    NavigationBar.setStyle(resolvedScheme);
  }, [resolvedScheme]);

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  );
}

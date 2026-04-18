import { DARK_THEME, LIGHT_THEME } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { useLayoutEffect, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import * as StatusBar from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { selectedTheme } = useThemeStore();

  const systemScheme = colorScheme ?? "light";

  const resolvedScheme = selectedTheme.value === "auto"
    ? systemScheme
    : selectedTheme.value;

  const paperTheme = useMemo(() => {
    return resolvedScheme === "dark" ? DARK_THEME : LIGHT_THEME;
  }, [resolvedScheme]);

  useLayoutEffect(() => {
    const updateInterface = async () => {
      await SystemUI.setBackgroundColorAsync(theme.colors.elevation.level5);
      StatusBar.setStatusBarStyle(resolvedScheme);
      NavigationBar.setStyle(resolvedScheme);
    }
    updateInterface();
  }, [resolvedScheme]);

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  );
}

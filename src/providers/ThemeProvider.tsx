import { DARK_THEME, LIGHT_THEME } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import SystemUIProvider from "./SystemUIProvider";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { selectedTheme } = useThemeStore();

  const systemScheme = colorScheme ?? "light";

  const resolvedScheme = useMemo(() => {
    return selectedTheme.value === "auto"
      ? systemScheme
      : selectedTheme.value;
  }, [selectedTheme.value, systemScheme]);

  const paperTheme = useMemo(() => {
    return resolvedScheme === "dark" ? DARK_THEME : LIGHT_THEME;
  }, [resolvedScheme]);

  return (
    <PaperProvider theme={paperTheme}>
      <SystemUIProvider resolvedScheme={resolvedScheme}>
        {children}
      </SystemUIProvider>
    </PaperProvider>
  );
}

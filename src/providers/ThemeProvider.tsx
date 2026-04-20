import { DARK_THEME, LIGHT_THEME } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { useEffect, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);

  useEffect(() => {
    if (selectedTheme.value === "auto") {
      setResolvedTheme(colorScheme === "dark" ? "dark" : "light");
    } else {
      setResolvedTheme(selectedTheme.value);
    }
  }, [selectedTheme.value, colorScheme, setResolvedTheme]);

  const paperTheme = useMemo(() => {
    return resolvedTheme === "dark" ? DARK_THEME : LIGHT_THEME;
  }, [resolvedTheme]);

  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  );
}

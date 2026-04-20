import { useLayoutEffect } from "react";
import type { PropsWithChildren } from "react";
import { useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useThemeStore } from "@/stores/theme";

export default function SystemUIProvider({ children }: PropsWithChildren) {
  const theme = useTheme();

  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useLayoutEffect(() => {
    const updateInterface = async () => {
      await SystemUI.setBackgroundColorAsync(theme.colors.elevation.level5);
      NavigationBar.setStyle(resolvedTheme);
    };
    updateInterface();
  }, [resolvedTheme]);

  return (
    <>
      <StatusBar
        translucent
        style={resolvedTheme === "dark" ? "light" : "dark"}
      />
      {children}
    </>
  );
}

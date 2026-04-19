import { useLayoutEffect } from "react";
import type { PropsWithChildren } from "react";
import { useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

interface ISystemProviderProps extends PropsWithChildren {
  resolvedScheme: "light" | "dark";
}

export default function SystemUIProvider({ children, resolvedScheme }: ISystemProviderProps) {
  const theme = useTheme();

  useLayoutEffect(() => {
    const updateInterface = async () => {
      await SystemUI.setBackgroundColorAsync(theme.colors.elevation.level5);
      NavigationBar.setStyle(resolvedScheme);
    };
    updateInterface();
  }, [resolvedScheme]);
  
  return (
    <>
      <StatusBar translucent style={resolvedScheme === "dark" ? "light" : "dark"} />
      {children}
    </>
  );
}

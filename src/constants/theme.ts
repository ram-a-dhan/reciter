import { IThemeOption } from "@/types/theme";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "rgb(39, 108, 43)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(170, 245, 163)",
    onPrimaryContainer: "rgb(0, 34, 4)",
    secondary: "rgb(82, 99, 79)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(213, 232, 207)",
    onSecondaryContainer: "rgb(17, 31, 15)",
    tertiary: "rgb(56, 101, 106)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(188, 235, 240)",
    onTertiaryContainer: "rgb(0, 32, 35)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(252, 253, 246)",
    onBackground: "rgb(26, 28, 25)",
    surface: "rgb(252, 253, 246)",
    onSurface: "rgb(26, 28, 25)",
    surfaceVariant: "rgb(222, 229, 216)",
    onSurfaceVariant: "rgb(66, 73, 64)",
    outline: "rgb(114, 121, 111)",
    outlineVariant: "rgb(194, 201, 189)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 49, 45)",
    inverseOnSurface: "rgb(240, 241, 235)",
    inversePrimary: "rgb(143, 216, 138)",
    elevation: {
      level0: "transparent",
      level1: "rgb(241, 246, 236)",
      level2: "rgb(235, 241, 230)",
      level3: "rgb(229, 237, 224)",
      level4: "rgb(226, 236, 222)",
      level5: "rgb(222, 233, 218)"
    },
    surfaceDisabled: "rgba(26, 28, 25, 0.12)",
    onSurfaceDisabled: "rgba(26, 28, 25, 0.38)",
    backdrop: "rgba(44, 50, 42, 0.4)",
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "rgb(143, 216, 138)",
    onPrimary: "rgb(0, 57, 10)",
    primaryContainer: "rgb(6, 83, 21)",
    onPrimaryContainer: "rgb(170, 245, 163)",
    secondary: "rgb(186, 204, 179)",
    onSecondary: "rgb(37, 52, 35)",
    secondaryContainer: "rgb(59, 75, 56)",
    onSecondaryContainer: "rgb(213, 232, 207)",
    tertiary: "rgb(160, 207, 212)",
    onTertiary: "rgb(0, 54, 59)",
    tertiaryContainer: "rgb(31, 77, 82)",
    onTertiaryContainer: "rgb(188, 235, 240)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(26, 28, 25)",
    onBackground: "rgb(226, 227, 221)",
    surface: "rgb(26, 28, 25)",
    onSurface: "rgb(226, 227, 221)",
    surfaceVariant: "rgb(66, 73, 64)",
    onSurfaceVariant: "rgb(194, 201, 189)",
    outline: "rgb(140, 147, 136)",
    outlineVariant: "rgb(66, 73, 64)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(226, 227, 221)",
    inverseOnSurface: "rgb(47, 49, 45)",
    inversePrimary: "rgb(39, 108, 43)",
    elevation: {
      level0: "transparent",
      level1: "rgb(32, 37, 31)",
      level2: "rgb(35, 43, 34)",
      level3: "rgb(39, 49, 37)",
      level4: "rgb(40, 51, 39)",
      level5: "rgb(42, 54, 41)"
    },
    surfaceDisabled: "rgba(226, 227, 221, 0.12)",
    onSurfaceDisabled: "rgba(226, 227, 221, 0.38)",
    backdrop: "rgba(44, 50, 42, 0.4)"
  }
};

export const themeOptions: IThemeOption[] = [
  {
    label: "Auto",
    value: "auto",
    icon: "theme-light-dark",
  },
  {
    label: "Light",
    value: "light",
    icon: "white-balance-sunny",
  },
  {
    label: "Dark",
    value: "dark",
    icon: "moon-waning-crescent",
  },
];

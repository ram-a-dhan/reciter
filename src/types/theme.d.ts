import type { ComponentProps } from "react";
import type Icon from "@expo/vector-icons/MaterialCommunityIcons";

export interface IThemeOption {
  label: "Auto" | "Light" | "Dark";
  value: "auto" | "light" | "dark";
  icon: ComponentProps<typeof Icon>["name"];
}

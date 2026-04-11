import { Appbar, Text, useTheme } from "react-native-paper";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";

export default function AppBar({ options }: BottomTabHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level5 }}>
      <Appbar.Content
        title={
          options.title === "Home"
            ? "Reciter"
            : options.title
        }
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: "row",
    alignItems: "center",
  },
});
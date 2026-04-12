import { Appbar, Text, useTheme } from "react-native-paper";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";

export default function AppBar({ options }: BottomTabHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level5 }}>
      <Appbar.Content
        title={
          options.title === "Home"
            ? <View style={styles.titleBox}>
                <Image
                  source={require("@/assets/icons/reciter/reciter2.png")}
                  width={24}
                  height={24}
                  style={styles.titleImg}
                />
                <Text style={theme.fonts.titleLarge}>
                  Reciter
                </Text>
              </View>
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
    gap: 4,
  },
  titleImg: {
    width: 24,
    height: 24,
  },
});
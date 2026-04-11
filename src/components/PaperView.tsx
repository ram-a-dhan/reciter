import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface IPaperViewProps extends ComponentProps<typeof SafeAreaView> {}

export default function PaperView({ children, style }: IPaperViewProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level3 }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

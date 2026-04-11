import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface ILibrarySectionProps {
  title: string;
}

export default function LibrarySection({ title }: ILibrarySectionProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.elevation.level3 },
      ]}
    >
      <Text style={theme.fonts.titleMedium}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBlock: 8,
    paddingInline: 16,
  },
});
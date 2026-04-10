import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface ILibrarySectionProps {
  title: string;
}

export default function LibrarySection({ title }: ILibrarySectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          theme.fonts.titleMedium,
          {
            color: theme.colors.primary,
            fontWeight: "900",
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary,
          },
        ]}
      >
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
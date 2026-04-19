import { memo } from "react";
import { StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";

interface ILibrarySectionProps {
  title: string;
}

function LibrarySection({ title }: ILibrarySectionProps) {
  const theme = useTheme();

  return (
    <List.Section
      style={[
        styles.container,
        { backgroundColor: theme.colors.elevation.level3 },
      ]}
    >
      <List.Subheader>{title}</List.Subheader>
    </List.Section>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBlock: 0,
    paddingBlock: 8,
  },
});

export default memo(LibrarySection);

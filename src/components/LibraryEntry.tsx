import { StyleSheet, View } from "react-native";
import { Avatar, IconButton, Text, TouchableRipple, useTheme } from "react-native-paper";

export default function LibraryEntry({
  chapterNumber,
  chapterName,
  verseStart,
  verseEnd,
  timestamp
}: ILibraryEntry) {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={() => {}}
      rippleColor={theme.colors.primaryContainer.replace("1)", "0.25)")}
      borderless
    >
      <View style={styles.container}>
        <Avatar.Text
          label={`${chapterNumber}`}
          labelStyle={{ color: theme.colors.onPrimaryContainer }}
          style={{ backgroundColor: theme.colors.primaryContainer}}
        />

        <View style={styles.textContainer}>
          <Text style={theme.fonts.titleMedium}>
            {chapterName}
          </Text>
          <Text style={theme.fonts.bodyMedium}>
            Verse {verseStart}-{verseEnd}
          </Text>
          <Text style={theme.fonts.bodySmall}>
            {new Date(timestamp).toLocaleString("en-GB")}
          </Text>
        </View>

        <IconButton
          icon="dots-vertical"
          onPress={() => {}}
        />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingBlock: 8,
    paddingLeft: 16,
  },
  textContainer: {
    flex: 2,
  },
});
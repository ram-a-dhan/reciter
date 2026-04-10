import { StyleSheet, View } from "react-native";
import { Avatar, IconButton, Text, TouchableRipple, useTheme } from "react-native-paper";

interface ILibraryEntryProps {
  id: string;
  chapterNumber: number;
  chapterName: string;
  verseStart: number;
  verseEnd: number;
  timestamp: number;
}

export default function LibraryEntry({
  chapterNumber,
  chapterName,
  verseStart,
  verseEnd,
  timestamp
}: ILibraryEntryProps) {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={() => {}}
      borderless
    >
      <View style={styles.container}>
        <Avatar.Text label={`${chapterNumber}`} />

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
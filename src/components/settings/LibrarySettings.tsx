import { useState } from "react";
import { View } from "react-native";
import { List, Switch, TouchableRipple } from "react-native-paper";

export default function LibrarySettings() {
  const [chapterNumberValue, setChapterNumberValue] = useState(true);
  const [isSkipFatihaValue, setIsSkipFatihaValue] = useState(true);

  return (
    <>
      <List.Section title="Library">
        <TouchableRipple
          onPress={() => setChapterNumberValue(!chapterNumberValue)}
          borderless
        >
          <List.Item
            title="Use Arabic Number"
            description={chapterNumberValue ? "Chapter number is eastern arabic." : "Chapter number is western arabic."}
            left={(props) => <List.Icon {...props} icon="abjad-arabic" />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <Switch value={chapterNumberValue} />
              </View>
            )}
          />
        </TouchableRipple>

        <TouchableRipple
          onPress={() => setIsSkipFatihaValue(!isSkipFatihaValue)}
          borderless
        >
          <List.Item
            title="Skip Al-Fatiha"
            description={isSkipFatihaValue ? "Al-Fatiha will not be recorded." : "Al-Fatiha will be recorded."}
            left={(props) => <List.Icon {...props} icon="door-sliding" />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <Switch value={isSkipFatihaValue} />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>

    </>
  );
}

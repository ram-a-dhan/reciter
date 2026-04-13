import { useState } from "react";
import { View } from "react-native";
import { List, Switch, TouchableRipple } from "react-native-paper";

export default function LibrarySettings() {
  const [isArabic, setIsArabic] = useState(true);
  const [isSkip, setIsSkip] = useState(true);

  return (
    <>
      <List.Section title="Library">
        <TouchableRipple
          onPress={() => setIsArabic(!isArabic)}
          borderless
        >
          <List.Item
            title="Use Arabic Number"
            description={isArabic ? "Chapter number is eastern arabic." : "Chapter number is western arabic."}
            left={(props) => <List.Icon {...props} icon={isArabic ? "abjad-arabic" : "numeric-4-box-outline"} />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <Switch value={isArabic} />
              </View>
            )}
          />
        </TouchableRipple>

        <TouchableRipple
          onPress={() => setIsSkip(!isSkip)}
          borderless
        >
          <List.Item
            title="Skip Al-Fatiha"
            description={isSkip ? "Al-Fatiha will not be recorded." : "Al-Fatiha will be recorded."}
            left={(props) => <List.Icon {...props} icon={isSkip ? "door-sliding" : "door-sliding-open"} />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <Switch value={isSkip} />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>
    </>
  );
}

import { useLibraryStore } from "@/stores/library";
import { View } from "react-native";
import { List, TouchableRipple } from "react-native-paper";
import MaterialSwitch from "@/components/MaterialSwitch";

export default function LibrarySettings() {
  const isArabic = useLibraryStore((state) => state.isArabic);
  const setIsArabic = useLibraryStore((state) => state.setIsArabic);
  const isSkip = useLibraryStore((state) => state.isSkip);
  const setIsSkip = useLibraryStore((state) => state.setIsSkip);

  return (
    <>
      <List.Section title="Library">
        <TouchableRipple
          onPress={() => setIsArabic(!isArabic)}
          borderless
        >
          <List.Item
            style={{ paddingRight: 16 }}
            title="Use Arabic Number"
            description={isArabic ? "Chapter number is eastern arabic." : "Chapter number is western arabic."}
            left={(props) => <List.Icon {...props} icon={isArabic ? "abjad-arabic" : "numeric-4-box-outline"} />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <MaterialSwitch
                  selected={isArabic}
                  onPress={() => {}}
                />
              </View>
            )}
          />
        </TouchableRipple>

        <TouchableRipple
          onPress={() => setIsSkip(!isSkip)}
          borderless
        >
          <List.Item
            style={{ paddingRight: 16 }}
            title="Skip Al-Fatiha"
            description={isSkip ? "Al-Fatiha will not be recorded." : "Al-Fatiha will be recorded."}
            left={(props) => <List.Icon {...props} icon={isSkip ? "door-sliding" : "door-sliding-open"} />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <MaterialSwitch
                  selected={isSkip}
                  onPress={() => {}}
                />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>
    </>
  );
}

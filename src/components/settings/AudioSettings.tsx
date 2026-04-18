import { useTranslationStore } from "@/stores/translation";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { List, TouchableRipple } from "react-native-paper";

export default function AudioSettings() {
  const router = useRouter();

  const selectedTranslation = useTranslationStore((state) => state.selectedTranslation);
  
  return (
    <>
      <List.Section title="Audio">
        <TouchableRipple
          onPress={() => router.push("/settings/translations")}
          borderless
        >
          <List.Item
            title="Translation Language"
            description={selectedTranslation.label}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => (
              <View {...props}>
                <List.Icon icon="chevron-right" />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>
    </>
  );
}

import TranslationOptionAvailable from "@/components/options/TranslationOptionAvailable";
import TranslationOptionDownloaded from "@/components/options/TranslationOptionDownloaded";
import PaperView from "@/components/PaperView";
import { useTranslationStore } from "@/stores/translation";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationsScreen() {
  const insets = useSafeAreaInsets();

  const translations = useTranslationStore((state) => state.translations);

  return (
    <PaperView style={{ paddingBottom: insets.bottom }}>
      <ScrollView>
        <List.Section title="Downloaded">
          {translations
            .filter(({ isDownloaded }) => isDownloaded)
            .map((langOption, index) => (
              <TranslationOptionDownloaded
                key={index}
                translationOption={langOption}
              />
            ))
          }
        </List.Section>

        {!!translations.filter(({ isDownloaded }) => !isDownloaded).length && (
          <List.Section title="Available for Download">
            {translations
              .filter(({ isDownloaded }) => !isDownloaded)
              .map((langOption, index) => (
                <TranslationOptionAvailable
                  key={index}
                  translationOption={langOption}
                />
              ))
            }
          </List.Section>
        )}
      </ScrollView>
    </PaperView>
  );
}

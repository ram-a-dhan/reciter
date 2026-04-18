import { useTranslationStore } from "@/stores/translation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, List, Text, TouchableRipple, useTheme } from "react-native-paper";

interface ILangOptionDownloadedProps {
  translationOption: ITranslationOption;
}

export default function TranslationOptionAvailable({ translationOption }: ILangOptionDownloadedProps) {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const toggleIsDownloaded = useTranslationStore((state) => state.toggleIsDownloaded);

  const onPressDownload = async (value: string) => {
    setIsLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        toggleIsDownloaded(value, true);
        resolve();
      }, 3000);
    });
    setIsLoading(false);
  };

  return (
    <TouchableRipple
      onPress={() => {}}
      borderless
    >
      <List.Item
        style={styles.paddingFix}
        title={translationOption.label}
        right={(props) => (
          <View {...props} style={styles.actionButtons}>
            <Text style={theme.fonts.labelSmall}>
              60MB
            </Text>
            <IconButton
              icon="download"
              onPress={() => onPressDownload(translationOption.value)}
              loading={isLoading}
            />
          </View>
        )}
      />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  paddingFix: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
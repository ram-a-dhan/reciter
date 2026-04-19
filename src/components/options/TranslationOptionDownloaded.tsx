import { useTranslationStore } from "@/stores/translation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, List, Menu, RadioButton, TouchableRipple, useTheme } from "react-native-paper";

interface ILangOptionDownloadedProps {
  translationOption: ITranslationOption;
}

export default function TranslationOptionDownloaded({ translationOption }: ILangOptionDownloadedProps) {
  const theme = useTheme();

  const [isVisibleMenu, setIsVisibleMenu] = useState(false);

  const translations = useTranslationStore((state) => state.translations);
  const selectedTranslation = useTranslationStore((state) => state.selectedTranslation);
  const setSelectedTranslation = useTranslationStore((state) => state.setSelectedTranslation);
  const toggleIsDownloaded = useTranslationStore((state) => state.toggleIsDownloaded);

  const isEnglish = translationOption.value === translations[0].value;

  const toggleMenu = () => {
    setIsVisibleMenu(!isVisibleMenu);
  };

  const onPressRemove = (value: string) => {
    if (selectedTranslation.value === value) {
      setSelectedTranslation(translations[0]);
    }
    toggleIsDownloaded(value, false);
    toggleMenu();
  };

  return (
    <TouchableRipple
      onPress={() => setSelectedTranslation(translationOption)}
      borderless
    >
      <List.Item
        style={styles.paddingFix}
        title={translationOption.label}
        right={(props) => (
          <View {...props} style={styles.actionButtons}>
            <View pointerEvents="none">
              <RadioButton
                value={translationOption.value}
                status={selectedTranslation.value === translationOption.value ? "checked" : "unchecked"}
              />
            </View>

            <Menu
              visible={isVisibleMenu}
              onDismiss={toggleMenu}
              anchorPosition="bottom"
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={toggleMenu}
                  disabled={isEnglish}
                />
              }
            >
              <Menu.Item
                leadingIcon="minus-circle"
                title="Remove"
                onPress={() => onPressRemove(translationOption.value)}
              />
            </Menu>
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
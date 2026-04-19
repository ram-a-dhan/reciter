import { useTranslationStore } from "@/stores/translation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Menu,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

interface ILangOptionDownloadedProps {
  translationOption: ITranslationOption;
}

export default function TranslationOptionDownloaded({ translationOption }: ILangOptionDownloadedProps) {
  const theme = useTheme();

  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);

  const translations = useTranslationStore((state) => state.translations);
  const selectedTranslation = useTranslationStore((state) => state.selectedTranslation);
  const setSelectedTranslation = useTranslationStore((state) => state.setSelectedTranslation);
  const toggleIsDownloaded = useTranslationStore((state) => state.toggleIsDownloaded);

  const isEnglish = translationOption.value === translations[0].value;

  const toggleMenu = () => {
    setIsVisibleMenu(!isVisibleMenu);
  };

  const toggleDialog = () => {
    setIsVisibleDialog(!isVisibleDialog);
  };

  const onPressRemove = (value: string) => {
    if (selectedTranslation.value === value) {
      setSelectedTranslation(translations[0]);
    }
    toggleIsDownloaded(value, false);
    toggleDialog();
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
                onPress={() => {
                  toggleMenu();
                  toggleDialog();
                }}
              />
            </Menu>

            <Portal>
              <Dialog
                visible={isVisibleDialog}
                dismissable
                dismissableBackButton
                onDismiss={toggleDialog}
              >
                <Dialog.Title>Remove</Dialog.Title>
                <Dialog.Content>
                  <Text>
                    Remove this translation?
                  </Text>
                  <Text>
                    {translationOption.label}
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    textColor={theme.colors.secondary}
                    onPress={toggleDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    textColor={theme.colors.error}
                    onPress={() => onPressRemove(translationOption.value)}
                  >
                    OK
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
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
import { THEME_OPTIONS } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { IThemeOption } from "@/types/theme";
import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, List, Portal, TouchableRipple } from "react-native-paper";
import ThemeOption from "@/components/options/ThemeOption";

export default function AppearanceSettings() {
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setSelectedTheme = useThemeStore((state) => state.setSelectedTheme);

  const onPressTheme = (themeOption: IThemeOption) => {
    setSelectedTheme(themeOption);
    toggleDialog();
  };

  const toggleDialog = () => {
    setIsVisibleDialog(!isVisibleDialog);
  };

  return (
    <>
      <List.Section title="Appearance">
        <TouchableRipple
          onPress={toggleDialog}
          borderless
        >
          <List.Item
            title="App Theme"
            description={selectedTheme.label}
            left={(props) => <List.Icon {...props} icon={selectedTheme.icon} />}
            right={(props) => (
              <View {...props} pointerEvents="none">
                <List.Icon icon="chevron-right" />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>

      <Portal>
        <Dialog
          visible={isVisibleDialog}
          dismissable
          dismissableBackButton
          onDismiss={toggleDialog}
        >
          <Dialog.Title>App Theme</Dialog.Title>
          <Dialog.ScrollArea style={{ paddingInline: 0 }}>
            {THEME_OPTIONS.map((themeOption, index) => (
              <ThemeOption
                key={index}
                themeOption={themeOption}
                selectedTheme={selectedTheme}
                onPress={onPressTheme}
              />
            ))}
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={toggleDialog}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

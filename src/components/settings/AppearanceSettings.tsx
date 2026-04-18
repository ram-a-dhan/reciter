import { THEME_OPTIONS } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme";
import { IThemeOption } from "@/types/theme";
import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, List, Portal, RadioButton, TouchableRipple } from "react-native-paper";
import ThemeOption from "@/components/options/ThemeOption";

export default function AppearanceSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setSelectedTheme = useThemeStore((state) => state.setSelectedTheme);

  const onPressTheme = (themeOption: IThemeOption) => {
    setSelectedTheme(themeOption);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <List.Section title="Appearance">
        <TouchableRipple
          onPress={() => setIsOpen(!isOpen)}
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
          visible={isOpen}
          dismissable
          dismissableBackButton
          onDismiss={() => setIsOpen(!isOpen)}
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
            <Button onPress={() => setIsOpen(!isOpen)}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

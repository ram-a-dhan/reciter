import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, List, Portal, RadioButton, TouchableRipple } from "react-native-paper";
import type { ComponentProps } from "react";
import type Icon from "@expo/vector-icons/MaterialCommunityIcons";

type IIconName = ComponentProps<typeof Icon>["name"];

interface IThemeOption {
  label: string;
  value: string;
  icon: IIconName;
}

const themeOptions: IThemeOption[] = [
  {
    label: "Auto",
    value: "auto",
    icon: "theme-light-dark",
  },
  {
    label: "Light",
    value: "light",
    icon: "white-balance-sunny",
  },
  {
    label: "Dark",
    value: "dark",
    icon: "moon-waning-crescent",
  },
];

export default function AppearanceSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<IThemeOption>(themeOptions[0]);

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
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
          />
        </TouchableRipple>
      </List.Section>

      <Portal>
        <Dialog
          visible={isOpen}
          dismissable={false}
          dismissableBackButton
          onDismiss={() => setIsOpen(!isOpen)}
        >
          <Dialog.Title>Theme</Dialog.Title>
          <Dialog.ScrollArea style={{ paddingInline: 0 }}>
            {themeOptions.map(({ label, value, icon }, index) => (
              <TouchableRipple
                key={index}
                onPress={() => {
                  setSelectedTheme({ label, value, icon });
                  setIsOpen(!isOpen);
                }}
                borderless
              >
                <List.Item
                  title={label}
                  left={(props) => <List.Icon {...props} icon={icon} />}
                  right={(props) => (
                    <View {...props} pointerEvents="none">
                      <RadioButton
                        value={value}
                        status={selectedTheme.value === value ? "checked" : "unchecked"}
                      />
                    </View>
                  )}
                />
              </TouchableRipple>
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

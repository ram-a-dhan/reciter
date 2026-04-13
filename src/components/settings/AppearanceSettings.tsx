import { useState } from "react";
import { View } from "react-native";
import { List, RadioButton, TouchableRipple } from "react-native-paper";
import type { ComponentProps } from "react";
import type Icon from "@expo/vector-icons/MaterialCommunityIcons";

type IIconName = ComponentProps<typeof Icon>["name"];

interface IThemeOption {
  label: string;
  value: string;
  description: string;
  icon: IIconName;
}

const themeOptions: IThemeOption[] = [
  {
    label: "Auto",
    value: "auto",
    description: "Follow device's system theme.",
    icon: "theme-light-dark",
  },
  {
    label: "Light",
    value: "light",
    description: "Clear view on everything.",
    icon: "white-balance-sunny",
  },
  {
    label: "Dark",
    value: "dark",
    description: "Easy on the eyes.",
    icon: "moon-waning-crescent",
  },
];

export default function AppearanceSettings() {
  const [themeValue, setThemeValue] = useState("auto");

  return (
    <>
      <List.Section title="Theme">
        {themeOptions.map(({ label, value, description, icon }, index) => (
          <TouchableRipple
            key={index}
            onPress={() => setThemeValue(value)}
            borderless
          >
            <List.Item
              title={label}
              description={description}
              left={(props) => <List.Icon {...props} icon={icon} />}
              right={(props) => (
                <View {...props} pointerEvents="none">
                  <RadioButton
                    value={value}
                    status={themeValue === value ? "checked" : "unchecked"}
                  />
                </View>
              )}
            />
          </TouchableRipple>
        ))}
      </List.Section>
    </>
  );
}

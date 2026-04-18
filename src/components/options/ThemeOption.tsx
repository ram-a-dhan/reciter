import { IThemeOption } from "@/types/theme";
import { View } from "react-native";
import { List, RadioButton, TouchableRipple } from "react-native-paper";

interface IThemeOptionProps {
  themeOption: IThemeOption,
  selectedTheme: IThemeOption,
  onPress: (themeOption: IThemeOption) => void,
}

export default function ThemeOption({
  themeOption: { label, value, icon },
  selectedTheme,
  onPress,
}: IThemeOptionProps) {
  return (
    <TouchableRipple
      onPress={() => onPress({ label, value, icon })}
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
  );
}

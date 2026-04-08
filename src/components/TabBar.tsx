import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomNavigation, TouchableRipple, useTheme } from "react-native-paper";

export default function TabBar({ navigation, state, descriptors, insets }: BottomTabBarProps) {
  const theme = useTheme();

  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      labeled={true}
      shifting={true}
      renderTouchable={({ key, ...props }) => (
        <TouchableRipple
          key={key}
          {...props}
          rippleColor={theme.colors.primary}
          borderless={false}
        />
      )}
      onTabPress={({ route }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (options.tabBarIcon)
          return options.tabBarIcon({ focused, color, size: 24 });
        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        return label as string;
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
}
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { BottomNavigation, Text, useTheme } from "react-native-paper";

export default function TabBar({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) {
  const theme = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scaleAnim.setValue(0.5);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 10,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [state.index, scaleAnim]);

  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      labeled={true}
      shifting={false}
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
      renderLabel={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        return (
          <Text
            style={[
              theme.fonts.labelMedium,
              {
                color: focused ? theme.colors.primary : color,
                textAlign: "center",
              },
            ]}
          >
            {options.title}
          </Text>
        );
      }}
      activeColor={theme.colors.primaryContainer}
      inactiveColor={theme.colors.onSurfaceVariant}
      style={{ backgroundColor: theme.colors.elevation.level5 }}
      activeIndicatorStyle={{
        backgroundColor: theme.colors.primary,
        transform: [{ scaleX: scaleAnim }],
      }}
    />
  );
}

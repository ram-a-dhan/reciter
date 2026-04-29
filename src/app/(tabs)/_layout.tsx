import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Dimensions } from "react-native";

type IIconName = ComponentProps<typeof Icon>["name"];

interface IRoute {
  name: string;
  title: string;
  icon: {
    focused: IIconName,
    blurred: IIconName,
  },
}

const routes: IRoute[] = [
  {
    name: "home",
    title: "Home",
    icon: {
      focused: "home",
      blurred: "home-outline",
    },
  },
  {
    name: "library",
    title: "Library",
    icon: {
      focused: "book-open-variant",
      blurred: "book-open-variant-outline",
    },
  },
  {
    name: "settings",
    title: "Settings",
    icon: {
      focused: "cog",
      blurred: "cog-outline",
    },
  },
];

export default function TabsLayout() {
  const { width } = Dimensions.get("window");

  return (
    <>
      <Tabs
        screenOptions={{
          header: (props) => <AppBar {...props} />,
          transitionSpec: {
            animation: "spring",
            config: {
              friction: 100,
              tension: 100,
            },
          },
          sceneStyleInterpolator: ({ current, }) => ({
            sceneStyle: {
              transform: [{
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0 ,1],
                  outputRange: [-width, 0 , width],
                }),
              }],
            },
          }),
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        {routes.map(({ name, title, icon }, index) => (
          <Tabs.Screen
            key={index}
            name={name}
            options={{
              title,
              tabBarIcon: ({ focused, ...props }) => (
                <Icon
                  name={focused ? icon.focused : icon.blurred}
                  {...props}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}

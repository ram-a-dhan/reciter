import TabBar from "@/components/TabBar";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Appbar } from "react-native-paper";

export default function TabsLayout () {
  return (
    <>
      <Tabs
        screenOptions={{
          header: ({ options }) => (
            <Appbar.Header>
              <Appbar.Content title={options.title === "Home" ? "Reciter": options.title} />
            </Appbar.Header>
          ),
        }}
        tabBar={(props) =><TabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? "book-open-variant" : "book-open-variant-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? "cog" : "cog-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        
      </Tabs>
    </>
  );
}

import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabsLayout () {
  return (
    <>
      <NativeTabs>
        <NativeTabs.Trigger name="home">
          <Icon src={require("@/assets/icons/home.png")} />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="library">
          <Icon src={require("@/assets/icons/library.png")} />
          <Label>Library</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon src={require("@/assets/icons/settings.png")} />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}

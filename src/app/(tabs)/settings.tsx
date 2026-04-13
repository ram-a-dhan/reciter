import PaperView from "@/components/PaperView";
 import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import LibrarySettings from "@/components/settings/LibrarySettings";
import { ScrollView } from "react-native";

export default function SettingsTab() {
  return (
    <PaperView>
      <ScrollView>
        <AccountSettings />
        <AppearanceSettings />
        <LibrarySettings />
      </ScrollView>
    </PaperView>
  );
}

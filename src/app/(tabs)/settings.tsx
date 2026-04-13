import PaperView from "@/components/PaperView";
 import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import LibrarySettings from "@/components/settings/LibrarySettings";
import { ScrollView } from "react-native";

export default function SettingsTab() {
  return (
    <PaperView>
      <ScrollView>
        <AccountSettings />
        <AppearanceSettings />
        <AudioSettings />
        <LibrarySettings />
      </ScrollView>
    </PaperView>
  );
}

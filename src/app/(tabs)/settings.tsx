import PaperView from "@/components/PaperView";
import { StyleSheet, Text } from "react-native";

export default function SettingsTab() {
  return (
    <PaperView style={styles.container}>
      <Text>Hello Settings</Text>
    </PaperView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

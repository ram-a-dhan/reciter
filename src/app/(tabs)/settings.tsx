import PaperView from "@/components/PaperView";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

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

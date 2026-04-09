import PaperView from "@/components/PaperView";
import { StyleSheet, Text } from "react-native";

export default function LibraryTab() {
  return (
    <PaperView style={styles.container}>
      <Text>Hello Library</Text>
    </PaperView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

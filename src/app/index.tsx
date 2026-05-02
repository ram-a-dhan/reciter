import { Redirect } from "expo-router";
import { registerNotification } from "@/utils/notification";

registerNotification();

export default function Index() {
  return (
    <Redirect href="/(tabs)/home" />
  );
}

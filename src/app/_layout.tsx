import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import Providers from "@/providers";
import ListenerNotification from "@/components/ListenerNotification";

// Controls how notifications are presented when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Deprecated; Replaced with shouldShowBanner and shouldShowList
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: true,
  }),
});


export default function RootLayout() {
  return (
    <>
      <Providers>
        <ListenerNotification />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "black" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
        </Stack>
      </Providers>
    </>
  );
}

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  LISTENER_NOTIFICATION_CATEGORY_ID,
  LISTENER_NOTIFICATION_CHANNEL_ID,
  LISTENER_NOTIFICATION_IDENTIFIER,
  LISTENER_NOTIFICATION_ACTION_ID,
} from "@/constants/notification";

export async function setupNotification(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      LISTENER_NOTIFICATION_CHANNEL_ID,
      {
        name: "Listener Status",
        importance: Notifications.AndroidImportance.MAX,
      },
    );
  }

  await Notifications.setNotificationCategoryAsync(
    LISTENER_NOTIFICATION_CATEGORY_ID,
    [{
      identifier: LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING,
      buttonTitle: "Stop Listening",
      options: {
        isDestructive: true,
        isAuthenticationRequired: false,
        opensAppToForeground: false,
      },
    }],
  );

  return true;
}

export async function showListenerNotification(title?: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: LISTENER_NOTIFICATION_IDENTIFIER,
    content: {
      title: title ? `Listening to ${title}` : "Listening...",
      body: "Tap to open the app",
      categoryIdentifier: LISTENER_NOTIFICATION_CATEGORY_ID,
      // sticky = cannot be swiped away; ongoing = shown as progress style
      sticky: true,
      autoDismiss: false,
      data: { navigateTo: "/(tabs)/home" },
    },
    trigger: null, // fire immediately
  });
}

export async function dismissListenerNotification(): Promise<void> {
  await Notifications.dismissNotificationAsync(LISTENER_NOTIFICATION_IDENTIFIER);
}

import { router } from "expo-router";
import { PermissionsAndroid, Platform } from "react-native";
import NotifyKit, {
  AndroidForegroundServiceType,
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
} from "react-native-notify-kit";
import { useListenerStore } from "@/stores/listener";
import { stopListenerTranscription } from "@/utils/listener";
import {
  LISTENER_NOTIFICATION_CHANNEL_ID,
  LISTENER_NOTIFICATION_IDENTIFIER,
  LISTENER_NOTIFICATION_ACTION_ID,
} from "@/constants/notification";

export async function setupNotification(): Promise<boolean> {
  if (Platform.OS === "android") {
    await NotifyKit.createChannel({
      id: LISTENER_NOTIFICATION_CHANNEL_ID,
      name: "Listener Status",
      importance: AndroidImportance.LOW,
      visibility: AndroidVisibility.PUBLIC,
    });
  }

  const { authorizationStatus } = await NotifyKit.requestPermission();

  return authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

export async function setupMicrophone(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: "Microphone Permission",
      message: "This app needs microphone access to listen to recitations.",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function showListenerNotification(title?: string): Promise<void> {
  await NotifyKit.displayNotification({
    id: LISTENER_NOTIFICATION_IDENTIFIER,
    title: title ? `Listening to ${title}` : "Listening...",
    body: "Tap to open the app",
    android: {
      channelId: LISTENER_NOTIFICATION_CHANNEL_ID,
      ongoing: true,
      asForegroundService: true,
      foregroundServiceTypes: [
        AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE,
      ],
      autoCancel: false,
      smallIcon: "notification_icon",
      visibility: AndroidVisibility.PUBLIC,
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
      actions: [
        {
          title: "STOP LISTENING",
          pressAction: { id: LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING },
        },
      ],
    },
  });
}

export async function dismissListenerNotification(): Promise<void> {
  await NotifyKit.stopForegroundService();
  await NotifyKit.cancelNotification(LISTENER_NOTIFICATION_IDENTIFIER);
}

export async function registerNotification() {
  // Required for notificatipn's asForegroundService: true
  NotifyKit.registerForegroundService(() => {
    return new Promise(() => {
      // Keep the promise alive as long as the service runs
      // This is intentionally never resolved
    });
  });

  // Notification interaction when app is in background or killed
  NotifyKit.onBackgroundEvent(async ({ type, detail }) => {
    if (
      type === EventType.ACTION_PRESS &&
      detail.pressAction?.id === LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING
    ) {
      useListenerStore.getState().setIsListening(false);
      await stopListenerTranscription();
      await dismissListenerNotification();
      return;
    }

    if (type === EventType.PRESS) {
      router.push("/(tabs)/home");
      return;
    }
  });
}
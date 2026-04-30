import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useListenerStore } from "@/stores/listener";
import {
  setupNotification,
  showListenerNotification,
  dismissListenerNotification,
} from "@/utils/notification";
import { LISTENER_NOTIFICATION_ACTION_ID } from "@/constants/notification";

export function useListenerNotification() {
  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const isReady = useRef(false);

  // One-time setup
  useEffect(() => {
    setupNotification()
      .then((granted) => {
        isReady.current = granted;
      });
  }, []);

  // Sync isListening → notification
  useEffect(() => {
    if (!isReady.current) return;

    if (isListening) {
      showListenerNotification();
    } else {
      dismissListenerNotification();
    }
  }, [isListening]);

  // Handle notification interactions
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { actionIdentifier } = response;

        // User tapped "Stop Listening" action button
        if (actionIdentifier === LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING) {
          setIsListening(false);
          return;
        }

        // User tapped the notification body → navigate to home
        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          router.push("/(tabs)/home");
        }
      });

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  // Cleanup on unmount (app killed)
  useEffect(() => {
    return () => {
      dismissListenerNotification();
    };
  }, []);
}

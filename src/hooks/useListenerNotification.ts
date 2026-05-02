import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import NotifyKit, { EventType } from "react-native-notify-kit";
import { useListenerStore } from "@/stores/listener";
import {
  setupNotification,
  showListenerNotification,
  dismissListenerNotification,
} from "@/utils/notification";
import { LISTENER_NOTIFICATION_ACTION_ID } from "@/constants/notification";

export default function useListenerNotification() {
  const [isReady, setIsReady] = useState(false);

  const isMounted = useRef(false);

  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);

  // Setup on mount
  useEffect(() => {
    setupNotification()
      .then((granted) => {
        setIsReady(granted);
      });
  }, []);

  // Show/dismiss based on isListening
  useEffect(() => {
    if (!isReady) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (isListening) {
      showListenerNotification();
    } else {
      dismissListenerNotification();
    }
  }, [isListening, isReady]);

  // Interaction when app is in foreground
  useEffect(() => {
    const unsubscribe = NotifyKit.onForegroundEvent(({ type, detail }) => {
      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id ===
          LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING
      ) {
        setIsListening(false);
        return;
      }

      if (type === EventType.PRESS) {
        router.push("/(tabs)/home");
        return;
      }
    });

    return unsubscribe;
  }, []);
}
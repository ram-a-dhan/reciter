import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import NotifyKit, { EventType } from "react-native-notify-kit";
import { useListenerStore } from "@/stores/listener";
import {
  setupNotification,
  showListenerNotification,
  dismissListenerNotification,
} from "@/utils/notification";
import {
  initListenerInstance,
  startListenerTranscription,
  stopListenerTranscription,
  releaseListenerInstance,
} from "@/utils/listener";
import { LISTENER_NOTIFICATION_ACTION_ID } from "@/constants/notification";

export default function useListener() {
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(false);

  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);
  const setIsTransitioning = useListenerStore((state) => state.setIsTransitioning);

  // Setup on mount
  useEffect(() => {
    setIsTransitioning(true);
    dismissListenerNotification()
      .then(() => setupNotification())
      .then((granted) => setIsReady(granted))
      .then(() => initListenerInstance())
      .then(() => setIsTransitioning(false));

    return () => {
      releaseListenerInstance();
    };
  }, []);

  // Notification + Listener in sync
  useEffect(() => {
    if (!isReady) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (isListening) {
      setIsTransitioning(true);
      showListenerNotification().then(() => {
        return startListenerTranscription({
          onText: (text) => {
            // TODO: verse matcher
            console.log(text);
          },
          onEnd: () => {
            setIsListening(false);
          },
        })
      })
      .then(() => setIsTransitioning(false));
    } else {
      setIsTransitioning(true);
      stopListenerTranscription().then(() => {
        return dismissListenerNotification();
      })
      .then(() => setIsTransitioning(false));
    }
  }, [isListening, isReady]);

  // Foreground notification interactions
  useEffect(() => {
    const unsubscribe = NotifyKit.onForegroundEvent(({ type, detail }) => {
      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id === LISTENER_NOTIFICATION_ACTION_ID.STOP_LISTENING
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
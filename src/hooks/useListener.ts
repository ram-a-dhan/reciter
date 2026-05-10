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
import { matchVerse } from "@/utils/verseMatcher";
import { getQuranIndex, initQuranIndex } from "@/utils/quranIndex";
import { LISTENER_NOTIFICATION_ACTION_ID } from "@/constants/notification";
import quranMeta from "@/assets/quran/quran-meta.json";

export default function useListener() {
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(false);

  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);
  const setIsTransitioning = useListenerStore((state) => state.setIsTransitioning);
  const activeSession = useListenerStore(state => state.activeSession);
  const updateActiveSession = useListenerStore(state => state.updateActiveSession);
  const clearActiveSession = useListenerStore(state => state.clearActiveSession);

  // Setup on mount
  useEffect(() => {
    setIsTransitioning(true);
    dismissListenerNotification()
      .then(() => setupNotification())
      .then((granted) => setIsReady(granted))
      .then(() => initQuranIndex())
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
            const result = matchVerse(
              text,
              getQuranIndex(),
              activeSession?.chapterNumber,
              activeSession?.verseEnd,
            );

            if (!result) return;

            // TODO: Check fine-tuning results
            // console.log("text", text);
            // console.log("result", result);

            updateActiveSession(result);
            const meta = quranMeta.find(q => q.chapterNumber === result.chapterNumber);
            if (meta && meta.verseCount === result.verseNumber) {
              updateActiveSession(result);
              requestAnimationFrame(() => clearActiveSession());
            }
          },
          onEnd: () => {
            setIsListening(false);
          },
        })
      })
      .then(() => setIsTransitioning(false));
    } else {
      setIsTransitioning(true);
      stopListenerTranscription()
      .then(() => clearActiveSession())
      .then(() => dismissListenerNotification())
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
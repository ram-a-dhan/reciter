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
import {
  playTranslation,
  stopTranslation,
} from "@/utils/translationPlayer";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * How many consecutive matches from the same chapter are required before
 * the session is anchored. Guards against ta'awwudh (→ 16:98) and basmalah
 * (→ 1:1 / 27:30) falsely opening a session on the preamble.
 */
const ANCHOR_CONFIRM_COUNT = 2;

// ─── Pending anchor type ──────────────────────────────────────────────────────

interface IPendingAnchor {
  chapterNumber: number;
  verseNumber: number;
  count: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useListener() {
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(false);

  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);
  const setIsTransitioning = useListenerStore((state) => state.setIsTransitioning);
  const activeSession = useListenerStore((state) => state.activeSession);
  const updateActiveSession = useListenerStore((state) => state.updateActiveSession);
  const clearActiveSession = useListenerStore((state) => state.clearActiveSession);

  /**
   * Ref mirror of activeSession so onText (a stale closure) always reads
   * the latest session without needing to re-subscribe or restart transcription.
   */
  const activeSessionRef = useRef(activeSession);
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  /** Holds unconfirmed matches before the session is anchored. */
  const pendingAnchorRef = useRef<IPendingAnchor | null>(null);

  // ─── Mount: setup notification + init whisper + quran index ────────────────

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

  // ─── Main effect: start/stop transcription ─────────────────────────────────

  useEffect(() => {
    if (!isReady) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (isListening) {
      setIsTransitioning(true);
      showListenerNotification()
        .then(() =>
          startListenerTranscription({
            /**
             * onText — whisper drives everything:
             *  1. Build pending anchor (guards ta'awwudh / basmalah false starts).
             *  2. On anchor confirmed: open session + play translation.
             *  3. On subsequent matches: update session + play translation.
             *  4. Backward matches and same-verse repeats are ignored.
             */
            onText: (text) => {
              const session = activeSessionRef.current;

              const result = matchVerse({
                sttSlice: text,
                corpus: getQuranIndex(),
                activeChapterNumber: session?.chapterNumber,
                activeVerseNumber: session?.verseEnd,
              });

              if (!result) return;

              // TODO: Check fine-tuning results
              console.log("text", text);
              console.log("result", result);

              // ── Case 1: No session yet — build pending anchor ─────────────
              if (!session) {
                const pending = pendingAnchorRef.current;

                if (!pending || pending.chapterNumber !== result.chapterNumber) {
                  pendingAnchorRef.current = {
                    chapterNumber: result.chapterNumber,
                    verseNumber: result.verseNumber,
                    count: 1,
                  };
                  return;
                }

                const updated: IPendingAnchor = {
                  chapterNumber: pending.chapterNumber,
                  verseNumber: result.verseNumber,
                  count: pending.count + 1,
                };
                pendingAnchorRef.current = updated;

                if (updated.count < ANCHOR_CONFIRM_COUNT) return;

                // Confirmed — anchor session and play
                pendingAnchorRef.current = null;
                updateActiveSession(result);
                playTranslation({
                  chapter: result.chapterNumber,
                  verse: result.verseNumber,
                });
                return;
              }

              // ── Case 2: Chapter jumped ────────────────────────────────────
              if (result.chapterNumber !== session.chapterNumber) {
                updateActiveSession(result); // closes + saves current, opens new
                playTranslation({
                  chapter: result.chapterNumber,
                  verse: result.verseNumber,
                });
                return;
              }

              // ── Case 3: Same chapter ──────────────────────────────────────
              const delta = result.verseNumber - session.verseEnd;

              // Backward or same verse — ignore
              if (delta <= 0) return;

              updateActiveSession(result);
              playTranslation({
                chapter: result.chapterNumber,
                verse: result.verseNumber,
              });

              // Last verse of chapter reached
              const quranIndex = getQuranIndex();
              const lastVerse = quranIndex
                .filter((v) => v.chapterNumber === result.chapterNumber)
                .at(-1);
              if (lastVerse && result.verseNumber === lastVerse.verseNumber) {
                requestAnimationFrame(() => clearActiveSession());
              }
            },

            onEnd: () => {
              setIsListening(false);
            },
          })
        )
        .then(() => setIsTransitioning(false));
    } else {
      // User stopped — tear down everything
      setIsTransitioning(true);
      pendingAnchorRef.current = null;
      stopTranslation();
      stopListenerTranscription()
        .then(() => clearActiveSession())
        .then(() => dismissListenerNotification())
        .then(() => setIsTransitioning(false));
    }
  }, [isListening, isReady]);

  // ─── Foreground notification interactions ─────────────────────────────────

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

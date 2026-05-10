import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import quranMeta from "@/assets/quran/quran-meta.json";
import type { IMatchResult } from "@/utils/verseMatcher";

type IActiveSession = Omit<ILibraryEntry, "id"> | null;

interface IUseListenerStore {
  isListening: boolean;
  setIsListening: (payload: boolean) => void;
  toggleIsListening: () => void;
  isTransitioning: boolean;
  setIsTransitioning: (payload: boolean) => void;
  activeSession: IActiveSession;
  updateActiveSession: (payload: IMatchResult) => void;
  clearActiveSession: () => void;
}

export const useListenerStore = create<IUseListenerStore>()(
  immer((set) => ({
    isListening: false,
    setIsListening: (payload) => {
      set((state) => {
        state.isListening = payload;
      });
    },
    toggleIsListening: () => {
      set((state) => {
        state.isListening = !state.isListening;
      });
    },
    isTransitioning: false,
    setIsTransitioning: (payload) => {
      set((state) => {
        state.isTransitioning = payload;
      });
    },
    activeSession: null,
    updateActiveSession: (payload) => {
      set((state) => {
        // No active session yet — start one
        if (!state.activeSession) {
          const meta = quranMeta.find((q) => q.chapterNumber === payload.chapterNumber);
          state.activeSession = {
            chapterNumber: payload.chapterNumber,
            chapterName: meta!.chapterName,
            verseStart: payload.verseNumber,
            verseEnd: payload.verseNumber,
            timestamp: Date.now(),
          };
          return;
        }

        // Same chapter — just advance verseEnd
        if (payload.chapterNumber === state.activeSession.chapterNumber) {
          state.activeSession.verseEnd = payload.verseNumber;
          return;
        }

        // Different chapter: close current, open new
        // const completed: ILibraryEntry = { id: uuid(), ...state.activeSession }; // Save to library store
        const meta = quranMeta.find((q) => q.chapterNumber === payload.chapterNumber);
        state.activeSession = {
          chapterNumber: payload.chapterNumber,
          chapterName: meta!.chapterName,
          verseStart: payload.verseNumber,
          verseEnd: payload.verseNumber,
          timestamp: Date.now(),
        };
      });
    },
    clearActiveSession: () => {
      set((state) => {
        if (!state.activeSession) return;
        // const completed: ILibraryEntry = { id: uuid(), ...state.activeSession }; // Save to library store
        state.activeSession = null;
      });
    },
  })),
);

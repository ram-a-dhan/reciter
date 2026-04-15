import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IUseLibraryStore {
  entries: ILibraryEntry[];
  addEntry: (payload: ILibraryEntry) => void;
  removeEntry: (payload: string) => void;
  clearEntries: () => void;
  isArabic: boolean;
  setIsArabic: (payload: boolean) => void;
  isSkip: boolean;
  setIsSkip: (payload: boolean) => void;
}

export const useLibraryStore = create<IUseLibraryStore>()(
  persist(
    immer((set) => ({
      entries: [],
      addEntry: (payload) => {
        set((state) => {
          state.entries.unshift(payload);
        });
      },
      removeEntry: (payload) => {
        set((state) => {
          const found = state.entries.findIndex((entry) => entry.id === payload);
          if (found >= 0) state.entries.splice(found, 1);
        });
      },
      clearEntries: () => {
        set((state) => {
          state.entries = [];
        });
      },
      isArabic: true,
      setIsArabic: (payload) => {
        set((state) => {
          state.isArabic = payload;
        });
      },
      isSkip: true,
      setIsSkip: (payload) => {
        set((state) => {
          state.isSkip = payload;
        });
      },
    })),
    {
      name: "library-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  )
);

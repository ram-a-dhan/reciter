import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TRANSLATION_OPTIONS_V0 } from "@/constants/translation";

interface IUseTranslationStore {
  translations: ITranslationOption[];
  selectedTranslation: ITranslationOption;
  setSelectedTranslation: (payload: ITranslationOption) => void;
  toggleIsDownloaded: (value: string, isDownloaded?: boolean) => void;
}

export const useTranslationStore = create<IUseTranslationStore>()(
  persist(
    immer((set) => ({
      translations: TRANSLATION_OPTIONS_V0,
      selectedTranslation: TRANSLATION_OPTIONS_V0[0],
      setSelectedTranslation: (payload) => {
        set((state) => {
          state.selectedTranslation = payload;
        });
      },
      toggleIsDownloaded: (value, isDownloaded) => {
        set((state) => {
          const found = state.translations.findIndex((option) => option.value === value);
          if (found >= 0) {
            if (isDownloaded === undefined) {
              state.translations[found].isDownloaded = !state.translations[found].isDownloaded;
            } else {
              state.translations[found].isDownloaded = isDownloaded;
            }
          }
        });
      },
    })),
    {
      name: "translation-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
      migrate: (persitedState, version) => {
        const oldState = persitedState as Partial<IUseTranslationStore>;
        const oldTranslations = oldState.translations || [];

        // ---------------- VERSION 0 ---------------- 
        if (version === 0) {
          const downloadStatusMap = new Map(
            oldTranslations.map((ot) => [ot.value, ot.isDownloaded]),
          );

          const mergedTranslations: ITranslationOption[] = TRANSLATION_OPTIONS_V0.map(
            (newItem) => ({
              ...newItem,
              isDownloaded: downloadStatusMap.get(newItem.value) ?? newItem.isDownloaded,
            }),
          );

          return {
            ...oldState,
            translations: mergedTranslations,
          } as IUseTranslationStore;
        }

        return persitedState as IUseTranslationStore;
      },
    },
  )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeOptions } from "@/constants/theme";
import type { IThemeOption } from "@/types/theme";

interface IUseThemeStore {
  selectedTheme: IThemeOption;
  setSelectedTheme: (payload: IThemeOption) => void;
}

export const useThemeStore = create<IUseThemeStore>()(
  persist(
    immer((set) => ({
      selectedTheme: themeOptions[0],
      setSelectedTheme: (payload) => {
        set((state) => {
          state.selectedTheme = payload;
        });
      },
    })),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  )
);

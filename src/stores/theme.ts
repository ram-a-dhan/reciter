import { create } from "zustand";
import { createJSONStorage, persist,  } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeOptions } from "@/constants/theme";
import type { IThemeOption } from "@/types/theme";

interface IUseTheme {
  selectedTheme: IThemeOption;
  setSelectedTheme: (theme: IThemeOption) => void;
}

export const useThemeStore = create<IUseTheme>()(
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

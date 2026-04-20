import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEME_OPTIONS } from "@/constants/theme";
import type { IThemeOption } from "@/types/theme";

type IResolvedTheme = "light" | "dark";

interface IUseThemeStore {
  selectedTheme: IThemeOption;
  setSelectedTheme: (payload: IThemeOption) => void;
  resolvedTheme: IResolvedTheme;
  setResolvedTheme: (payload: IResolvedTheme) => void;
}

export const useThemeStore = create<IUseThemeStore>()(
  persist(
    immer((set) => ({
      selectedTheme: THEME_OPTIONS[0],
      setSelectedTheme: (payload) => {
        set((state) => {
          state.selectedTheme = payload;
        });
      },
      resolvedTheme: "dark",
      setResolvedTheme: (payload) => {
        set((state) => {
          state.resolvedTheme = payload;
        });
      },
    })),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedTheme: state.selectedTheme,
      }),
    },
  )
);

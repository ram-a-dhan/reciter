import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IUseListenerStore {
  isListening: boolean;
  setIsListening: (payload: boolean) => void;
  toggleIsListening: () => void;
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
  })),
);

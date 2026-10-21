import { create } from "zustand";

interface ToastState {
  message: string | null;
  isOpen: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  isOpen: false,
  showToast: (message: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({ message, isOpen: true });
    timeoutId = setTimeout(() => {
      set({ isOpen: false });
    }, 2400);
  },
  hideToast: () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({ isOpen: false });
  },
}));

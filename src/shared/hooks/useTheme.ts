import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  initTheme: () => void;
  toggleTheme: () => void;
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const themeStore = createStore<ThemeState>()((set, get) => ({
  theme: "light",
  initTheme: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    set({ theme });
    applyTheme(theme);
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    localStorage.setItem("theme", next);
    applyTheme(next);
  },
}));

export function useThemeStore(): ThemeState;
export function useThemeStore<T>(selector: (s: ThemeState) => T): T;
export function useThemeStore<T>(selector?: (s: ThemeState) => T) {
  return useStore(themeStore, selector!);
}

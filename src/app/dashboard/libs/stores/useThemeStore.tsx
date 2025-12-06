// "use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeType = "light" | "dark";

interface ThemeStateUnion {
  theme: ThemeType | undefined; // undefined якщо нема теми
  setTheme: (theme: ThemeType | undefined) => void;
}

export const useThemeStore = create<ThemeStateUnion>()(
  persist(
    (set) => ({
      theme: "dark", // Значення за замовчуванням
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-color" }
  )
);

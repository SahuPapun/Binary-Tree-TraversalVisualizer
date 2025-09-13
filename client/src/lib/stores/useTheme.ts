import { create } from "zustand";
import { getLocalStorage, setLocalStorage } from "../utils";

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useTheme = create<ThemeState>((set) => {
  // Initialize theme from localStorage or default to light
  const savedTheme = getLocalStorage('theme') || 'light';
  
  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply initial theme
  applyTheme(savedTheme);

  return {
    theme: savedTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        setLocalStorage('theme', newTheme);
        applyTheme(newTheme);
        return { theme: newTheme };
      }),
    setTheme: (theme) =>
      set(() => {
        setLocalStorage('theme', theme);
        applyTheme(theme);
        return { theme };
      }),
  };
});

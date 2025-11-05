import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export type Theme = 'light' | 'dark';
export type Currency = 'USD' | 'NGN' | 'VND' | 'EUR' | 'GBP' | 'JPY';
export type Language = 'English' | 'Hausa' | 'Yoruba' | 'Igbo' | 'Vietnamese' | 'Spanish' | 'French' | 'German' | 'Chinese';
interface AppState {
  theme: Theme;
  currency: Currency;
  language: Language;
  toggleTheme: () => void;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      currency: 'USD',
      language: 'English',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
import {create} from 'zustand';
import { themes } from '../constant/index.js';

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem('theme') || 'light',
  setTheme: (theme) => {
    if (themes.includes(theme)) {
      localStorage.setItem('theme', theme);
      set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      console.warn(`Theme "${theme}" is not supported.`);
    }
  }
}));

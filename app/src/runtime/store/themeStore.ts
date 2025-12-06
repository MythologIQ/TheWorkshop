import type { ThemeId, ThemeConfig } from '../../domain/theme';
import { THEMES, DEFAULT_THEME } from '../../domain/theme';

const STORAGE_KEY = 'workshop.theme';
let activeThemeId: ThemeId = DEFAULT_THEME.id;
const listeners = new Set<() => void>();

const storageAvailable = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadTheme = (): ThemeId => {
  if (!storageAvailable()) return DEFAULT_THEME.id;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_THEME.id;
  if (raw in THEMES) return raw as ThemeId;
  return DEFAULT_THEME.id;
};

const persistTheme = (id: ThemeId) => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Ignore storage failures.
  }
};

activeThemeId = loadTheme();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

export const getThemeId = (): ThemeId => activeThemeId;

export const getTheme = (): ThemeConfig => THEMES[activeThemeId] ?? DEFAULT_THEME;

export const setTheme = (id: ThemeId): void => {
  if (!(id in THEMES)) return;
  if (id === activeThemeId) return;
  activeThemeId = id;
  persistTheme(id);
  notify();
};

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

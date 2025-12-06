import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Locale } from '../../i18n/types';

export interface Preferences {
  locale: Locale;
  largerText: boolean;
  extraLabels: boolean;
}

const STORAGE_KEY = 'workshop.preferences';
const DEFAULT_PREFERENCES: Preferences = {
  locale: 'en',
  largerText: false,
  extraLabels: false,
};

const loadPreferences = (): Preferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const PreferencesContext = createContext<
  | {
      preferences: Preferences;
      updatePreferences: (patch: Partial<Preferences>) => void;
    }
  | undefined
>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(() => loadPreferences());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (patch: Partial<Preferences>) =>
    setPreferences((current) => ({ ...current, ...patch }));

  const value = useMemo(() => ({ preferences, updatePreferences }), [preferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

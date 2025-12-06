import { useSyncExternalStore } from 'react';
import { getTheme, getThemeId, subscribe, setTheme } from '../store/themeStore';

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getTheme, () => getTheme());
  const themeId = useSyncExternalStore(subscribe, getThemeId, () => getThemeId());

  return {
    theme,
    themeId,
    setTheme,
  };
};

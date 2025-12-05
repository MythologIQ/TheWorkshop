import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const uiBus = new EventTarget();
let uiState: { theme: Theme } = { theme: 'light' };

export const setTheme = (theme: Theme) => {
  uiState = { theme };
  uiBus.dispatchEvent(new Event('update'));
};

export const useUIStore = () => {
  const [theme, setLocalTheme] = useState<Theme>(uiState.theme);

  useEffect(() => {
    const handler = () => setLocalTheme(uiState.theme);
    uiBus.addEventListener('update', handler);
    return () => uiBus.removeEventListener('update', handler);
  }, []);

  return { theme, setTheme };
};

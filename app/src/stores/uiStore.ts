import { useEffect, useState } from 'react';
import { StationKey } from '../domain/project';

type Theme = 'light' | 'dark';

type UIState = {
  theme: Theme;
  activeStation: StationKey;
};

const uiBus = new EventTarget();
let uiState: UIState = { theme: 'light', activeStation: 'idea' };

const emit = () => uiBus.dispatchEvent(new Event('update'));

export const setTheme = (theme: Theme) => {
  uiState = { ...uiState, theme };
  emit();
};

export const setActiveStation = (station: StationKey) => {
  uiState = { ...uiState, activeStation: station };
  emit();
};

export const useUIStore = () => {
  const [state, setLocal] = useState<UIState>(uiState);

  useEffect(() => {
    const handler = () => setLocal({ ...uiState });
    uiBus.addEventListener('update', handler);
    return () => uiBus.removeEventListener('update', handler);
  }, []);

  return { ...state, setTheme, setActiveStation };
};

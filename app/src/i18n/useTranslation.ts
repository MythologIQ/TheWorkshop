import { TRANSLATIONS } from './translations';
import { usePreferences } from '../runtime/context/preferencesContext';

export const useTranslation = () => {
  const { preferences } = usePreferences();
  return TRANSLATIONS[preferences.locale] ?? TRANSLATIONS.en;
};

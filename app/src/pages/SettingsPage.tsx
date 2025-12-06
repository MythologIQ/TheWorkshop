import React from 'react';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTheme } from '../runtime/hooks/useTheme';
import { useTranslation } from '../i18n/useTranslation';
import { THEMES } from '../domain/theme';
import type { Locale } from '../i18n/types';

const languageOptions: { value: Locale; label: string; disabled?: boolean }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (coming soon)', disabled: true },
  { value: 'fr', label: 'Français (coming soon)', disabled: true },
];

const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  const { setTheme, themeId } = useTheme();
  const translation = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ locale: event.target.value as Locale });
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-900/10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Preferences</p>
        <h1 className="text-2xl font-semibold text-slate-900">{translation.headings.settingsTitle}</h1>
        <p className="text-sm text-slate-500">{translation.headings.settingsSubtitle}</p>
      </header>

      <form className="space-y-6">
        <fieldset className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.headings.settingsLanguage}
          </legend>
          <label htmlFor="language-select" className="text-sm font-medium text-slate-700">
            {translation.headings.settingsLanguage}
          </label>
          <select
            id="language-select"
            value={preferences.locale}
            onChange={handleLanguageChange}
            aria-describedby="language-help"
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <p id="language-help" className="text-xs text-slate-500">
            {translation.headings.settingsLanguageHelp}
          </p>
        </fieldset>

        <fieldset
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          aria-describedby="accessibility-help"
        >
          <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.headings.settingsAccessibility}
          </legend>
          <p id="accessibility-help" className="text-xs text-slate-500">
            {translation.headings.settingsAccessibilityHelp}
          </p>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.extraLabels}
                onChange={(event) => updatePreferences({ extraLabels: event.target.checked })}
                className="h-4 w-4 accent-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
              />
              {translation.headings.settingsExtraLabels}
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={preferences.largerText}
                onChange={(event) => updatePreferences({ largerText: event.target.checked })}
                className="h-4 w-4 accent-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
              />
              {translation.headings.settingsLargerFont}
            </label>
          </div>
        </fieldset>
        <fieldset
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          aria-describedby="theme-help"
        >
          <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.headings.settingsTheme}
          </legend>
          <p id="theme-help" className="text-xs text-slate-500">
            {translation.headings.settingsThemeHelp}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.values(THEMES).map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => setTheme(themeOption.id)}
                className={`flex flex-col gap-2 rounded-2xl border px-3 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 ${
                  themeId === themeOption.id
                    ? 'border-fuchsia-400 bg-white/70'
                    : 'border-slate-200 bg-white/40 hover:border-slate-400 hover:bg-white/60'
                }`}
                aria-pressed={themeId === themeOption.id}
              >
                <div
                  className="h-20 rounded-2xl border"
                  style={{
                    backgroundImage: themeOption.backgroundGradient,
                    borderColor:
                      themeId === themeOption.id ? 'rgba(244,114,182,0.5)' : 'rgba(148,163,184,0.35)',
                  }}
                />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">{themeOption.displayName}</p>
                  <p className="text-xs text-slate-500">{themeOption.iconSetId} icons</p>
                </div>
              </button>
            ))}
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default SettingsPage;

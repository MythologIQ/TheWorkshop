import React from 'react';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTranslation } from '../i18n/useTranslation';
import type { Locale } from '../i18n/types';

const languageOptions: { value: Locale; label: string; disabled?: boolean }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (coming soon)', disabled: true },
  { value: 'fr', label: 'Français (coming soon)', disabled: true },
];

const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
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
      </form>
    </section>
  );
};

export default SettingsPage;

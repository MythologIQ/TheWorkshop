import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTheme } from '../runtime/hooks/useTheme';
import { useTranslation } from '../i18n/useTranslation';
import { THEMES } from '../domain/theme';
import type { Locale } from '../i18n/types';
import { getModelChoices, PERFORMANCE_MODES, PerformanceModeId } from '../runtime/llm/model_config';
import { setLLMModelChoice, setLLMPerformanceMode } from '../runtime/llm/llmSettingsStore';
import { useLLMSettings } from '../runtime/llm/useLLMSettings';
import { useProjects } from '../runtime/hooks/useProjects';
import { exportProject } from '../runtime/export/export_project';
import { importProject, InvalidProjectFileError } from '../runtime/export/import_project';
import { useProfiles } from '../runtime/hooks/useProfiles';
import { DEFAULT_PROFILE_ID } from '../domain/profile';

const languageOptions: { value: Locale; label: string; disabled?: boolean }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (coming soon)', disabled: true },
  { value: 'fr', label: 'Français (coming soon)', disabled: true },
];

const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  const { setTheme, themeId } = useTheme();
  const translation = useTranslation();
  const llmSettings = useLLMSettings();
  const { selectedProject } = useProjects();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [projectToolsStatus, setProjectToolsStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { activeProfile, updateProfile, deleteProfile } = useProfiles();
  const [renameValue, setRenameValue] = useState(activeProfile?.displayName ?? '');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [managementMessage, setManagementMessage] = useState('');
  const modelOptions = getModelChoices();
  const performanceModes = PERFORMANCE_MODES;

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLLMModelChoice(event.target.value);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLLMPerformanceMode(event.target.value as PerformanceModeId);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ locale: event.target.value as Locale });
  };

  const handleExportProject = () => {
    if (!selectedProject) {
      setProjectToolsStatus(translation.projectTools.statusNeedsProject);
      return;
    }
    setProjectToolsStatus(translation.projectTools.statusExport);
    setIsExporting(true);
    try {
      exportProject(selectedProject.id);
    } catch (error) {
      console.error(error);
      setProjectToolsStatus(translation.projectTools.statusImportFailure);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setProjectToolsStatus('');
    try {
      await importProject(file);
      setProjectToolsStatus(translation.projectTools.statusImportSuccess);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof InvalidProjectFileError
          ? error.message
          : translation.projectTools.statusImportFailure;
      setProjectToolsStatus(message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setRenameValue(activeProfile?.displayName ?? '');
    setDeleteConfirm('');
    setManagementMessage('');
  }, [activeProfile]);

  const handleRename = () => {
    if (!activeProfile || !renameValue.trim()) return;
    updateProfile(activeProfile.id, { displayName: renameValue.trim() });
    setManagementMessage(translation.profiles.renameSuccess);
  };

  const handleDelete = () => {
    if (!activeProfile) return;
    const success = deleteProfile(activeProfile.id);
    if (success) {
      setManagementMessage(translation.profiles.deleteSuccess);
      setDeleteConfirm('');
    } else {
      setManagementMessage(translation.profiles.deleteDisabled);
    }
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
          className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          aria-describedby="ai-help"
        >
          <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.ai.heading}
          </legend>
          <p id="ai-help" className="text-xs text-slate-500">
            {translation.ai.description}
          </p>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="ai-model-select" className="text-sm font-medium text-slate-700">
                {translation.ai.modelLabel}
              </label>
              <select
                id="ai-model-select"
                value={llmSettings.modelId}
                onChange={handleModelChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
                aria-describedby="ai-model-help"
              >
                {modelOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p id="ai-model-help" className="text-xs text-slate-500">
                {translation.ai.modelHint}
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="ai-mode-select" className="text-sm font-medium text-slate-700">
                {translation.ai.modeLabel}
              </label>
              <select
                id="ai-mode-select"
                value={llmSettings.performanceModeId}
                onChange={handleModeChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
                aria-describedby="ai-mode-help"
              >
                {performanceModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <p id="ai-mode-help" className="text-xs text-slate-500">
                {translation.ai.modeHint}
              </p>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {translation.ai.tokenCap}: {llmSettings.tokenCap} tokens (max)
            </p>
            <label className="flex items-start gap-3 text-sm font-medium text-slate-700">
              <input
                id="ai-adaptive-toggle"
                type="checkbox"
                checked={preferences.adaptiveCoachingEnabled}
                onChange={(event) => updatePreferences({ adaptiveCoachingEnabled: event.target.checked })}
                className="h-4 w-4 accent-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
                aria-describedby="ai-adaptive-help"
              />
              <span className="flex flex-col gap-1">
                <span>{translation.ai.adaptiveToggleLabel}</span>
                <p id="ai-adaptive-help" className="text-xs font-normal text-slate-500">
                  {translation.ai.adaptiveToggleHelp}
                </p>
              </span>
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
        <fieldset
          className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          aria-describedby="profile-management-help"
        >
          <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.profiles.managementHeading}
          </legend>
          <p id="profile-management-help" className="text-xs text-slate-500">
            {translation.profiles.managementDescription}
          </p>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700" htmlFor="profile-rename">
              {translation.profiles.renameLabel}
            </label>
            <input
              id="profile-rename"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
            />
            <p className="text-xs text-slate-500">{translation.profiles.renameHelp}</p>
            <button
              type="button"
              onClick={handleRename}
              disabled={!renameValue.trim() || !activeProfile}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              {translation.profiles.renameButton}
            </button>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {translation.profiles.deleteHeading}
            </p>
            <p className="text-xs text-slate-500">{translation.profiles.deleteWarning}</p>
            <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400" htmlFor="profile-delete">
              {translation.profiles.deleteConfirmLabel}
            </label>
            <input
              id="profile-delete"
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder={translation.profiles.deletePlaceholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={
                !activeProfile ||
                activeProfile.id === DEFAULT_PROFILE_ID ||
                deleteConfirm.trim() !== activeProfile.displayName
              }
              className="w-full rounded-2xl border border-red-400 bg-red-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-red-500 transition hover:border-red-500 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              {translation.profiles.deleteButton}
            </button>
            {managementMessage && (
              <p className="text-xs text-slate-500" aria-live="polite">
                {managementMessage}
              </p>
            )}
          </div>
        </fieldset>
          <fieldset
            className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            aria-describedby="project-tools-help"
          >
            <legend className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
              {translation.projectTools.heading}
            </legend>
            <p id="project-tools-help" className="text-xs text-slate-500">
              {translation.projectTools.description}
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleExportProject}
                disabled={!selectedProject || isExporting}
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                {translation.projectTools.exportLabel}
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  disabled={isImporting}
                  className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {translation.projectTools.importLabel}
                </button>
                <span className="text-xs text-slate-500">
                  {selectedProject ? selectedProject.name : translation.projectTools.statusNeedsProject}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">{translation.projectTools.safetyReminder}</p>
            {projectToolsStatus && (
              <p className="text-xs text-slate-400" aria-live="polite">
                {projectToolsStatus}
              </p>
            )}
        </fieldset>
        <input
          ref={fileInputRef}
          type="file"
          accept=".workshop.json,application/json"
          onChange={handleImportFileChange}
          className="sr-only"
        />
        <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            {translation.insights.heading}
          </p>
          <Link
            to="/insights"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {translation.insights.linkLabel}
          </Link>
          <p className="text-xs text-slate-500">{translation.insights.linkDescription}</p>
        </section>
      </form>
    </section>
  );
};

export default SettingsPage;

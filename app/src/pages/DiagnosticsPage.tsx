import React, { useMemo, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTranslation } from '../i18n/useTranslation';
import {
  getTelemetryState,
  resetTelemetry,
  setTelemetryEnabled,
  subscribe,
} from '../runtime/store/telemetryStore';
import type { StationKey } from '../domain/project';

const useTelemetry = () =>
  useSyncExternalStore(subscribe, getTelemetryState, () => getTelemetryState());

const DiagnosticsPage: React.FC = () => {
  const { preferences } = usePreferences();
  const translation = useTranslation();
  const telemetry = useTelemetry();

  const formattedStationVisits = useMemo(() => {
    return Object.entries(telemetry.stationVisitCounts).map(([stationKey, visits]) => ({
      stationKey: stationKey as StationKey,
      visits,
    }));
  }, [telemetry.stationVisitCounts]);

  const totalStationVisits = useMemo(
    () => formattedStationVisits.reduce((sum, entry) => sum + entry.visits, 0),
    [formattedStationVisits],
  );

  const lastResetText = telemetry.lastResetAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(telemetry.lastResetAt))
    : 'Never';

  return (
    <section
      className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-900/10"
      aria-label={translation.diagnostics.heading}
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Diagnostics</p>
        <h1 className="text-3xl font-semibold text-slate-900">{translation.diagnostics.heading}</h1>
        <p className="text-sm text-slate-500">{translation.diagnostics.description}</p>
        {preferences.extraLabels && (
          <p className="text-[11px] text-slate-500">{translation.headings.focusTip}</p>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.diagnostics.sessionsLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{telemetry.totalSessions}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.diagnostics.projectsLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{telemetry.totalProjectsCreated}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.diagnostics.tutorialsLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{telemetry.completedTutorials}</p>
        </article>
      </div>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {translation.diagnostics.stationVisitsHeading}
            </p>
            <p className="text-[11px] text-slate-400">{totalStationVisits} total visits</p>
          </div>
          <p className="text-[11px] text-slate-500">
            {translation.diagnostics.lastResetLabel}: {lastResetText}
          </p>
        </header>
        <div className="space-y-2">
          {formattedStationVisits.map(({ stationKey, visits }) => (
            <div
              key={stationKey}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            >
              <span className="text-slate-700">{translation.stationNames[stationKey] ?? stationKey}</span>
              <span className="font-semibold text-slate-900">{visits}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Telemetry controls</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => resetTelemetry()}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {translation.diagnostics.resetButton}
          </button>
          <button
            type="button"
            onClick={() => setTelemetryEnabled(!telemetry.enabled)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {telemetry.enabled ? translation.diagnostics.toggleOn : translation.diagnostics.toggleOff}
          </button>
        </div>
        <p className="text-xs text-slate-500">{translation.diagnostics.privacyStatement}</p>
      </section>
      <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{translation.insights.heading}</p>
        <Link
          to="/insights"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
        >
          {translation.insights.linkLabel}
        </Link>
        <p className="text-xs text-slate-500">{translation.insights.linkDescription}</p>
      </section>
    </section>
  );
};

export default DiagnosticsPage;

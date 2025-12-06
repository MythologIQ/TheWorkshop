import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTranslation } from '../i18n/useTranslation';
import {
  getActiveProfile,
  subscribe as subscribeProfiles,
} from '../runtime/store/profileStore';
import {
  getProjects,
  subscribe as subscribeProjects,
} from '../runtime/store/projectStore';
import {
  getTelemetryState,
  subscribe as subscribeTelemetry,
} from '../runtime/store/telemetryStore';
import type { StationKey } from '../domain/project';
import type { Project } from '../domain/project';

interface StationVisit {
  stationKey: StationKey;
  visits: number;
}

interface AdultInsightsData {
  profileId: string;
  profileName: string;
  totalProjects: number;
  completedProjects: number;
  reflectVisits: number;
  tutorialsCompleted: number;
  totalSessions: number;
  stationVisits: StationVisit[];
}

const computeInsightsData = (): AdultInsightsData => {
  const profile = getActiveProfile();
  const telemetry = getTelemetryState();
  const projects = getProjects();
  const stationVisits = Object.keys(telemetry.stationVisitCounts).map((key) => ({
    stationKey: key as StationKey,
    visits: telemetry.stationVisitCounts[key as StationKey] ?? 0,
  }));
  const completedProjects = projects.filter((project: Project) => project.status === 'completed').length;

  return {
    profileId: profile?.id ?? 'profile',
    profileName: profile?.displayName ?? 'Creator',
    totalProjects: projects.length,
    completedProjects,
    reflectVisits: telemetry.stationVisitCounts.reflect ?? 0,
    tutorialsCompleted: telemetry.completedTutorials,
    totalSessions: telemetry.totalSessions,
    stationVisits,
  };
};

const useAdultInsightsData = (): AdultInsightsData => {
  const [data, setData] = useState<AdultInsightsData>(() => computeInsightsData());

  useEffect(() => {
    const update = () => setData(computeInsightsData());
    const unsubscribers = [
      subscribeProjects(update),
      subscribeTelemetry(update),
      subscribeProfiles(update),
    ];
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return data;
};

const AdultInsightsPage: React.FC = () => {
  const { preferences } = usePreferences();
  const translation = useTranslation();
  const data = useAdultInsightsData();
  const totalStationVisits = useMemo(
    () => data.stationVisits.reduce((sum, entry) => sum + entry.visits, 0),
    [data.stationVisits],
  );
  const sortedStationVisits = useMemo(
    () => [...data.stationVisits].sort((a, b) => b.visits - a.visits),
    [data.stationVisits],
  );
  const reflectionRatio =
    data.totalSessions > 0 ? Math.round((data.reflectVisits / data.totalSessions) * 100) : 0;

  const handleExport = () => {
    if (typeof window === 'undefined') return;
    const summary = {
      profileId: data.profileId,
      profileName: data.profileName,
      totalProjects: data.totalProjects,
      completedProjects: data.completedProjects,
      tutorialsCompleted: data.tutorialsCompleted,
      reflectVisits: data.reflectVisits,
      stationVisits: data.stationVisits,
      totalSessions: data.totalSessions,
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adult-insights-${data.profileId}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-900/10"
      aria-label={translation.insights.heading}
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          {translation.insights.heading}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{translation.insights.heading}</h1>
        <p className="text-sm text-slate-500">{translation.insights.description}</p>
        <p className="text-xs text-slate-500">{translation.insights.privacyNote}</p>
        {preferences.extraLabels && (
          <p className="text-[11px] text-slate-400">Profile: {data.profileName}</p>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.insights.totalProjectsLabel}
          </p>
          <p data-testid="insights-total-projects" className="mt-2 text-2xl font-semibold text-slate-900">
            {data.totalProjects}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.insights.completedProjectsLabel}
          </p>
          <p
            data-testid="insights-completed-projects"
            className="mt-2 text-2xl font-semibold text-slate-900"
          >
            {data.completedProjects}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.insights.reflectionLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900" data-testid="insights-reflection-visits">
            {data.reflectVisits}
          </p>
          <p className="text-[11px] text-slate-500">
            {reflectionRatio}% of sessions included Reflect visits
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {translation.insights.tutorialCompletionsLabel}
          </p>
          <p
            data-testid="insights-tutorials"
            className="mt-2 text-2xl font-semibold text-slate-900"
          >
            {data.tutorialsCompleted}
          </p>
        </article>
      </div>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {translation.insights.stationBalanceHeading}
            </p>
            <p className="text-[11px] text-slate-400">
              {totalStationVisits} total visits
            </p>
          </div>
        </header>
        <div className="space-y-2">
          {sortedStationVisits.map(({ stationKey, visits }) => (
            <div
              key={stationKey}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
            >
              <span className="text-slate-700">{translation.stationNames[stationKey]}</span>
              <span className="font-semibold text-slate-900">{visits}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Adult controls</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {translation.insights.exportLabel}
          </button>
          <Link
            to="/projects"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            {translation.insights.drillInLabel}
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          {translation.insights.linkDescription}
        </p>
      </section>
    </section>
  );
};

export default AdultInsightsPage;

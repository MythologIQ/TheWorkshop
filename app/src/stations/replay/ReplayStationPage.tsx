import React, { useMemo, useState } from 'react';
import type { StationKey } from '../../domain/project';
import { useProjects } from '../../runtime/hooks/useProjects';
import { usePreferences } from '../../runtime/context/preferencesContext';
import { useTranslation } from '../../i18n/useTranslation';

const MAX_LABEL_LENGTH = 120;

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const ReplayStationPage: React.FC = () => {
  const translation = useTranslation();
  const { preferences } = usePreferences();
  const {
    selectedProject,
    addSnapshot,
    updateProject,
    createProject,
    selectProject,
  } = useProjects();
  const [label, setLabel] = useState(() => `Snapshot ${formatTimestamp(new Date().toISOString())}`);
  const [status, setStatus] = useState(() => translation.hints.timeTunnels);
  const [actionMessage, setActionMessage] = useState('');

  const snapshots = selectedProject?.snapshots ?? [];
  const sortedSnapshots = useMemo(
    () => [...snapshots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [snapshots],
  );

  const trimmedLabel = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      return `Snapshot ${formatTimestamp(new Date().toISOString())}`;
    }
    return trimmed.slice(0, MAX_LABEL_LENGTH);
  };

  const snapshotStateSummary = (state: Record<string, unknown>) => {
    const lineItems = [];
    if (state.title) lineItems.push(`Title: ${state.title}`);
    if (state.description) lineItems.push(`Notes: ${(state.description as string).slice(0, 80)}`);
    if (state.currentStation) lineItems.push(`Station: ${state.currentStation}`);
    if (typeof state.steps === 'object' && state.steps) {
      lineItems.push(`Steps: ${(state.steps as []).length}`);
    }
    if (typeof state.tests === 'object' && state.tests) {
      lineItems.push(`Tests: ${(state.tests as []).length}`);
    }
    return lineItems.slice(0, 4);
  };

  const getStationLabel = (station?: StationKey) => {
    if (!station) return translation.stationNames.idea;
    return translation.stationNames[station] ?? station;
  };

  const handleCreateSnapshot = () => {
    if (!selectedProject) return;
    const savedLabel = trimmedLabel();
    const snapshot = addSnapshot(selectedProject.id, savedLabel);
    if (snapshot) {
      setStatus(`Snapshot "${snapshot.label}" saved.`);
      setActionMessage('You can restore this version later without losing work.');
      setLabel(`Snapshot ${formatTimestamp(new Date().toISOString())}`);
    } else {
      setStatus('Unable to save snapshot right now.');
      setActionMessage('');
    }
  };

  const handleRestore = (snapshot: typeof sortedSnapshots[number]) => {
    if (!selectedProject) return;
    const confirmRestore = window.confirm(
      `Restore "${snapshot.label}"? This replaces current progress but keeps the snapshot history intact.`,
    );
    if (!confirmRestore) return;
    updateProject(selectedProject.id, {
      ...snapshot.projectState,
    });
    setStatus(`Replayed snapshot "${snapshot.label}". You can always branch from it again.`);
    setActionMessage('Replay keeps your timeline safe instead of telling you what you did wrong.');
  };

  const handleBranch = (snapshot: typeof sortedSnapshots[number]) => {
    if (!selectedProject) return;
    const branchLabel = `${snapshot.label} branch`;
    const confirmBranch = window.confirm(
      `Create a new branch from "${snapshot.label}"? This keeps your current project untouched.`,
    );
    if (!confirmBranch) return;
    const branch = createProject(branchLabel);
    updateProject(branch.id, {
      ...snapshot.projectState,
      title: snapshot.projectState.title ?? branchLabel,
      description: snapshot.projectState.description ?? selectedProject.description,
    });
    selectProject(branch.id);
    setStatus(`Branch "${branchLabel}" created and selected.`);
    setActionMessage('You can explore this path without touching the current project.');
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <h1 className="text-3xl font-semibold">{translation.nav.timeTunnels}</h1>
          <p className="mt-3 text-sm text-slate-400">{translation.descriptions.replay}</p>
          {preferences.extraLabels && (
            <p className="mt-2 text-[11px] text-slate-500">{translation.headings.focusTip}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{translation.nav.timeTunnels}</p>
            <h1 className="mt-2 text-3xl font-semibold">{translation.headings.timeTunnelsTitle}</h1>
            <p className="text-sm text-slate-400">{translation.headings.timeTunnelsSubtitle}</p>
            {preferences.extraLabels && (
              <p className="text-[11px] text-slate-500">{translation.hints.timeTunnels}</p>
            )}
          </header>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
            <label htmlFor="snapshot-label" className="text-sm font-medium text-slate-200">
              Snapshot label
            </label>
            <input
              id="snapshot-label"
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              maxLength={MAX_LABEL_LENGTH}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-100 focus:border-fuchsia-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
              placeholder="Describe this moment"
            />
            <button
              type="button"
              onClick={handleCreateSnapshot}
              className="rounded-full bg-fuchsia-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-fuchsia-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {translation.cta.saveSnapshot}
            </button>
            <p className="text-[11px] text-slate-400">{translation.hints.snapshotCap}</p>
          </div>

          <footer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{translation.headings.statusLabel}</p>
            <p className="text-sm text-slate-200" aria-live="polite">
              {status}
            </p>
            {actionMessage && <p className="text-[12px] text-slate-400">{actionMessage}</p>}
            {preferences.extraLabels && (
              <p className="text-[11px] text-slate-500">{translation.headings.focusTip}</p>
            )}
          </footer>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{translation.headings.snapshotsTitle}</p>
            <h2 className="text-2xl font-semibold">{translation.headings.snapshotsHeading}</h2>
          </header>

          {sortedSnapshots.length === 0 ? (
            <p className="text-sm text-slate-400">{translation.headings.snapshotsEmpty}</p>
          ) : (
            <div className="space-y-4">
              {sortedSnapshots.map((snapshot) => (
                <article
                  key={snapshot.id}
                  className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-100"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatTimestamp(snapshot.createdAt)}</p>
                      <h3 className="text-lg font-semibold">{snapshot.label}</h3>
                      {preferences.extraLabels && (
                        <p className="text-[11px] text-slate-500">
                          Station context: {getStationLabel(snapshot.projectState.currentStation)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestore(snapshot)}
                        className="rounded-full border border-fuchsia-500 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400 hover:bg-fuchsia-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {translation.cta.restore}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBranch(snapshot)}
                        className="rounded-full border border-slate-700 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-fuchsia-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {translation.cta.branch}
                      </button>
                    </div>
                  </div>

                  <details className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                      {translation.cta.inspectSnapshot}
                    </summary>
                    <div className="mt-3 space-y-2 text-xs text-slate-300">
                      {snapshotStateSummary(snapshot.projectState).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                      <p className="text-[11px] text-slate-500">{translation.hints.replayReminder}</p>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReplayStationPage;

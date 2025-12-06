import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StationKey } from '../domain/project';
import templates, { CONTENT_PACKS } from '../data/templates_builtin';
import { useProjects } from '../runtime/hooks/useProjects';
import { applyTemplate } from '../runtime/templates/applyTemplate';
import { useTranslation } from '../i18n/useTranslation';
import CreationLabStamp from '../components/CreationLabStamp';

const STATION_ROUTES: Record<StationKey, string> = {
  idea: '/dock/idea',
  build: '/bay/build',
  test: '/corridor/test',
  memory: '/vault/memory',
  reflect: '/bridge/reflect',
  share: '/deck/share',
  replay: '/tunnels/replay',
};

const formatTimestamp = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const ProjectSelectionPage: React.FC = () => {
  const { projects, createProject, selectProject } = useProjects();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  const translation = useTranslation();

  const templateGroups = useMemo(() => {
    const grouped = templates.reduce<Record<string, typeof templates>>((acc, template) => {
      if (!acc[template.packId]) acc[template.packId] = [];
      acc[template.packId].push(template);
      return acc;
    }, {});
    return Object.entries(grouped).map(([packId, list]) => ({
      packId,
      templates: list,
    }));
  }, []);

  const handleTemplate = (templateId: string, stations: StationKey[]) => {
    setIsApplying(true);
    try {
      applyTemplate(templateId);
      setStatusMessage(translation.templates.statusApplied);
      const targetStation = stations[0] ?? 'idea';
      navigate(STATION_ROUTES[targetStation]);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to apply template.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCreateProject = () => {
    const project = createProject('Untitled Project');
    setStatusMessage(translation.templates.statusApplied);
    const targetStation = project.currentStation ?? 'idea';
    navigate(STATION_ROUTES[targetStation]);
  };

  const handleSelectProject = (projectId: string, station: StationKey) => {
    selectProject(projectId);
    navigate(STATION_ROUTES[station]);
  };

  return (
    <section className="mx-auto max-w-6xl space-y-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{translation.templates.heading}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{translation.templates.heading}</h1>
        <p className="text-sm text-slate-500">{translation.templates.description}</p>
      </header>

      <section className="space-y-4">
        {templateGroups.map(({ packId, templates: packTemplates }) => (
          <article key={packId} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {CONTENT_PACKS[packId]?.name ?? 'Pack'}
                </p>
                <p className="text-sm text-slate-500">{CONTENT_PACKS[packId]?.description}</p>
              </div>
              <span className="text-xs text-slate-400">
                {packTemplates.length} template{packTemplates.length === 1 ? '' : 's'}
              </span>
            </header>
            <div className="grid gap-3 md:grid-cols-2">
              {packTemplates.map((template) => (
                <article
                  key={template.id}
                  className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{template.displayName}</h2>
                    <p className="text-sm text-slate-500">{template.description}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {translation.templates.recommended}:
                    <span className="ml-1 font-semibold text-slate-800">{translation.stationNames[template.recommendedStations[0]]}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTemplate(template.id, template.recommendedStations)}
                    disabled={isApplying}
                    className="rounded-full border border-fuchsia-500 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase text-fuchsia-500 transition hover:bg-fuchsia-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {translation.templates.startButton}
                  </button>
                </article>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {translation.templates.existingHeading}
            </p>
            <p className="text-[11px] text-slate-400">{projects.length} projects stored locally</p>
          </div>
          <button
            type="button"
            onClick={handleCreateProject}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:border-fuchsia-400 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
          >
            Create blank project
          </button>
        </header>
        {projects.length === 0 ? (
          <p className="text-xs text-slate-400">{translation.templates.noProjects}</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelectProject(project.id, project.currentStation)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left text-sm text-slate-800 transition hover:border-fuchsia-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
              >
                <span>{project.name}</span>
                <span className="text-[11px] text-slate-500">{formatTimestamp(project.updatedAt)}</span>
              </button>
            ))}
          </div>
        )}
        {statusMessage && (
          <p className="text-xs text-slate-500" aria-live="polite">
            {statusMessage}
          </p>
        )}
      </section>
      <CreationLabStamp className="mx-auto max-w-xs" />
    </section>
  );
};

export default ProjectSelectionPage;

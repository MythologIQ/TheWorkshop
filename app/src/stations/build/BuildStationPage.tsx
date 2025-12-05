import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildStep } from '../../domain/project';
import { newId } from '../../domain/id';
import { useAI } from '../../runtime/ai/AIProvider';
import { useProjects } from '../../runtime/hooks/useProjects';

const MAX_BUILD_STEPS = 12;
const MAX_NOTES_LENGTH = 300;
const MAX_HINTS = 3;

const buildSystemPrompt = (): string => `
You are the Assembly Bay helper. Stay gentle and kid-friendly, honor the Ask → Reflect → Plan → Act → Review loop, and keep every idea step short and safe.
Suggest only a few small next actions that match the child's tools and energy, and refuse anything that feels unsafe.
`.trim();

const buildUserPrompt = (step: BuildStep, projectName: string): string => `
Project: ${projectName || 'Unnamed project'}
Active step: ${step.text}
Notes: ${step.notes || '<none yet>'}

Share up to three friendly, concrete suggestions for the very next tiny action the child could try on this step.
Keep each suggestion short, no more than a sentence, and avoid making any automatic edits to the project.
`.trim();

const parseHints = (text: string): string[] => {
  if (!text.trim()) return [];
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .slice(0, MAX_HINTS);
    }
  } catch {
    // Ignore parsing errors and fall back to line-based parsing.
  }

  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-\d\.\s]*\s*/, '').trim())
    .filter(Boolean)
    .slice(0, MAX_HINTS);
};

const BuildStationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProject, updateProject } = useProjects();
  const { callStationModel } = useAI();
  const [hints, setHints] = useState<string[]>([]);
  const [aiStatus, setAiStatus] = useState('Ask for a tiny hint whenever you feel stuck.');
  const [isAsking, setIsAsking] = useState(false);

  const ensureBuildSteps = useCallback(() => {
    if (!selectedProject) return;
    const ideaSteps = selectedProject.idea?.starterSteps ?? [];
    const hasBuildSteps = (selectedProject.build?.steps?.length ?? 0) > 0;
    if (hasBuildSteps || ideaSteps.length === 0) return;
    const steps: BuildStep[] = ideaSteps.slice(0, MAX_BUILD_STEPS).map((text) => ({
      id: newId('build-step'),
      text,
      status: 'todo',
      notes: '',
    }));
    updateProject(selectedProject.id, {
      build: {
        steps,
        activeStepId: steps[0]?.id ?? null,
      },
    });
  }, [selectedProject, updateProject]);

  useEffect(() => {
    ensureBuildSteps();
  }, [ensureBuildSteps]);

  useEffect(() => {
    setHints([]);
    setAiStatus('Ask for a tiny hint whenever you feel stuck.');
  }, [selectedProject?.build?.activeStepId]);

  const build = selectedProject?.build;

  const steps = build?.steps ?? [];
  const activeStepId = build?.activeStepId ?? null;
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps.find((step) => step.status === 'todo') ?? null;

  const setActiveStep = useCallback(
    (stepId: string) => {
      if (!selectedProject?.build) return;
      const nextSteps = selectedProject.build.steps.map((step) => ({
        ...step,
        status: step.id === stepId ? 'active' : step.status === 'done' ? 'done' : 'todo',
      }));
      updateProject(selectedProject.id, { build: { steps: nextSteps, activeStepId: stepId } });
    },
    [selectedProject, updateProject],
  );

  const markActiveDone = useCallback(() => {
    if (!selectedProject?.build?.activeStepId) return;
    const nextSteps = selectedProject.build.steps.map((step) =>
      step.id === selectedProject.build!.activeStepId ? { ...step, status: 'done' } : step,
    );
    updateProject(selectedProject.id, { build: { steps: nextSteps, activeStepId: null } });
  }, [selectedProject, updateProject]);

  const reopenStep = useCallback(
    (stepId: string) => {
      if (!selectedProject?.build) return;
      const nextSteps = selectedProject.build.steps.map((step) =>
        step.id === stepId ? { ...step, status: 'todo' } : step,
      );
      updateProject(selectedProject.id, { build: { steps: nextSteps, activeStepId: stepId } });
    },
    [selectedProject, updateProject],
  );

  const handleNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value.slice(0, MAX_NOTES_LENGTH);
      if (!selectedProject?.build?.activeStepId) return;
      const nextSteps = selectedProject.build.steps.map((step) =>
        step.id === selectedProject.build!.activeStepId ? { ...step, notes: value } : step,
      );
      updateProject(selectedProject.id, {
        build: {
          steps: nextSteps,
          activeStepId: selectedProject.build.activeStepId,
        },
      });
    },
    [selectedProject, updateProject],
  );

  const askForHints = useCallback(async () => {
    if (!selectedProject || !activeStep) return;
    setIsAsking(true);
    setAiStatus('Asking the Assembly Bay for short hints...');
    let canvas = '';
    try {
      const generator = callStationModel('build', {
        systemPrompt: buildSystemPrompt(),
        userPrompt: buildUserPrompt(activeStep, selectedProject.name ?? selectedProject.title ?? 'project'),
      });
      for await (const chunk of generator) {
        canvas += chunk.token;
      }
      const parsed = parseHints(canvas);
      setHints(parsed);
      setAiStatus(parsed.length ? 'Hints listed below.' : 'The Workshop could not find a new spark.');
    } catch (error) {
      console.error('Build Station AI error', error);
      setAiStatus('The Workshop is resting. Try again soon.');
    } finally {
      setIsAsking(false);
    }
  }, [activeStep, selectedProject, callStationModel]);

  const notesCount = activeStep?.notes?.length ?? 0;

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-700">
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Select or create a project</h1>
          <p className="mt-2 text-sm text-slate-500">Pick a project from the Project Selection page before you build.</p>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-700">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">No steps yet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start in the Design Dock (Idea Station) to capture a mission and starter steps. Those steps become your build list.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dock/idea')}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Go to Idea Station
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">Assembly Bay • Build Station</h1>
          <p className="mt-2 text-sm text-slate-500">
            Work on one starter step at a time. Mark it active, add notes, and ask the Workshop for gentle hints.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Steps ({steps.length})</h2>
              <span className="text-xs text-slate-500">Only one active step at a time</span>
            </div>
            <div className="mt-4 space-y-4">
              {steps.map((step) => {
                const isActive = step.id === activeStep?.id;
                return (
                  <div
                    key={step.id}
                    className={`rounded-xl border px-4 py-3 ${
                      isActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{step.text}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {step.status === 'done'
                            ? 'Done'
                            : isActive
                            ? 'In progress'
                            : 'Todo'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {step.status === 'done' ? (
                          <button
                            type="button"
                            onClick={() => reopenStep(step.id)}
                            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-400"
                          >
                            Move back to todo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveStep(step.id)}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              isActive
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-300 text-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {isActive ? 'Active' : 'Work on this'}
                          </button>
                        )}
                      </div>
                    </div>
                    {step.notes && (
                      <p className="mt-2 text-xs text-slate-500">Notes: {step.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Active step</h2>
              <span className="text-xs text-slate-500">
                Notes up to {MAX_NOTES_LENGTH} chars
              </span>
            </div>
            {activeStep ? (
              <>
                <p className="mt-3 text-sm text-slate-500">
                  {activeStep.status === 'done'
                    ? 'Step marked done — reopen when you want to revisit it.'
                    : 'Describe what you are doing, then mark it done when finished.'}
                </p>
                <p className="mt-4 text-2xl font-semibold text-slate-900">{activeStep.text}</p>
                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Notes
                  <textarea
                    value={activeStep.notes ?? ''}
                    onChange={handleNotesChange}
                    className="mt-2 h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="Describe what you try next or what you learned."
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    {notesCount} / {MAX_NOTES_LENGTH} characters
                  </span>
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  {activeStep.status !== 'done' && (
                    <button
                      type="button"
                      onClick={markActiveDone}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Mark done
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={askForHints}
                    disabled={isAsking}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                      isAsking ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isAsking ? 'Asking for hints…' : 'Need ideas for this step?'}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">{aiStatus}</p>
                <div className="mt-3 space-y-2">
                  {hints.length === 0 ? (
                    <p className="text-xs text-slate-400">Hints will appear here.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {hints.map((hint, index) => (
                        <li key={`${hint}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  AI suggestions stay separate—copy them into your notes or steps if you like.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Choose a step to make active so you can jot notes and ask for hints.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BuildStationPage;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationIdea } from '../../domain/project';
import { useAI } from '../../runtime/ai/AIProvider';
import { useProjects } from '../../runtime/hooks/useProjects';

const IDEA_LIMITS = {
  title: 60,
  mission: 400,
  goal: 200,
  steps: 3,
  stepLength: 140,
};

const clampText = (value: string, max: number): string => (value.length > max ? value.slice(0, max) : value);

const clampIdeaFields = (idea: StationIdea): StationIdea => {
  const starterSteps = idea.starterSteps
    .map((step) => clampText(step, IDEA_LIMITS.stepLength).trim())
    .filter((step) => step.length > 0)
    .slice(0, IDEA_LIMITS.steps);

  return {
    title: clampText(idea.title, IDEA_LIMITS.title),
    mission: clampText(idea.mission, IDEA_LIMITS.mission),
    goal: clampText(idea.goal, IDEA_LIMITS.goal),
    starterSteps,
  };
};

const saturateStarterSteps = (steps: string[] = []): string[] => {
  const normalized = steps.slice(0, IDEA_LIMITS.steps).map((value) => value || '');
  while (normalized.length < IDEA_LIMITS.steps) {
    normalized.push('');
  }
  return normalized;
};

const buildIdeaSystemPrompt = (): string => `
You are the Idea Station helper in the Design Dock. You stay warm, kind, and simple for children.
Describe why the idea matters, use the Ask → Reflect → Plan → Act → Review loop, and keep answers short.
Respect safety rules and the Creativity Boundary spec while staying focused on a single little mission.
`.trim();

const buildIdeaUserPrompt = (idea: StationIdea): string => `
Current idea:
- Title: ${idea.title || '<empty>'}
- Mission: ${idea.mission || '<empty>'}
- Goal: ${idea.goal || '<empty>'}
- Starter steps: ${idea.starterSteps.filter(Boolean).join(' | ') || '<none yet>'}

Please reply in JSON like:
{"mission":"...", "goal":"...", "starterSteps":["...", "..."]}
Only supply up to three starter steps and keep each under ${IDEA_LIMITS.stepLength} chars.
`.trim();

const extractJsonFragment = (text: string): string | null => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end >= start) {
    return text.slice(start, end + 1);
  }
  return null;
};

const IdeaStationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProject, updateProject } = useProjects();
  const { callStationModel } = useAI();
  const [idea, setIdea] = useState<StationIdea>({
    title: '',
    mission: '',
    goal: '',
    starterSteps: ['', '', ''],
  });
  const [aiStatus, setAIStatus] = useState<string>('Safe prompting lives here.');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedProject) return;
    setIdea({
      title: selectedProject.idea?.title ?? '',
      mission: selectedProject.idea?.mission ?? '',
      goal: selectedProject.idea?.goal ?? '',
      starterSteps: saturateStarterSteps(selectedProject.idea?.starterSteps ?? []),
    });
  }, [selectedProject]);

  const persistIdea = useCallback(
    (nextIdea: StationIdea) => {
      if (!selectedProject) return;
      const safeIdea = clampIdeaFields(nextIdea);
      updateProject(selectedProject.id, { idea: safeIdea });
    },
    [selectedProject, updateProject],
  );

  const handleStepChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = clampText(event.target.value, IDEA_LIMITS.stepLength);
    setIdea((prev) => {
      const steps = [...prev.starterSteps];
      steps[index] = value;
      return {
        ...prev,
        starterSteps: steps,
      };
    });
  };

  const handleBlur = () => {
    persistIdea(idea);
  };

  const applyAIPrompt = async () => {
    if (!selectedProject) return;
    setIsAsking(true);
    setAIStatus('Asking the Workshop for a kinder plan...');
    let canvas = '';
    try {
      const generator = callStationModel('idea', {
        systemPrompt: buildIdeaSystemPrompt(),
        userPrompt: buildIdeaUserPrompt(idea),
      });
      for await (const chunk of generator) {
        canvas += chunk.token;
      }

      const trimmed = canvas.trim();
      const fragment = extractJsonFragment(trimmed) ?? trimmed;
      if (!fragment) {
        setAIStatus('The Workshop did not return a plan we could read.');
        return;
      }

      const parsed = JSON.parse(fragment);
      const merged: StationIdea = {
        ...idea,
        mission: typeof parsed.mission === 'string' ? parsed.mission : idea.mission,
        goal: typeof parsed.goal === 'string' ? parsed.goal : idea.goal,
        starterSteps: saturateStarterSteps(
          Array.isArray(parsed.starterSteps)
            ? parsed.starterSteps.map((step) => (typeof step === 'string' ? step : ''))
            : idea.starterSteps,
        ),
      };
      const safeMerged = clampIdeaFields(merged);
      setIdea(safeMerged);
      persistIdea(safeMerged);
      setAIStatus('The Workshop shared a friendly update.');
    } catch (error) {
      console.error('AI Idea Station error', error);
      setAIStatus('The Workshop is resting. Try again in a moment.');
    } finally {
      setIsAsking(false);
    }
  };

  const titleCount = useMemo(() => idea.title.length, [idea.title]);
  const missionCount = useMemo(() => idea.mission.length, [idea.mission]);
  const goalCount = useMemo(() => idea.goal.length, [idea.goal]);

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 text-slate-700">
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">No project selected</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pick a project on the Project Selection page so the Design Dock can keep your idea safe.
          </p>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Choose a project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Design Dock • Idea Station</h1>
          <p className="mt-2 text-slate-600">
            Refine the title, mission, goal, and starter steps. The Workshop keeps everything small and safe.
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
            Limits based on docs/CREATIVITY_BOUNDARY_SPEC.md (Title 60, Mission 400, Goal 200, Steps 3, 140 chars each).
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your idea</h2>
              <p className="text-sm text-slate-500">{aiStatus}</p>
            </div>
            <button
              type="button"
              onClick={applyAIPrompt}
              disabled={isAsking}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                isAsking ? 'cursor-wait bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isAsking ? 'Asking the Workshop…' : 'Ask the Workshop for help'}
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Title
              <input
                type="text"
                value={idea.title}
                onChange={(event) => setIdea((prev) => ({ ...prev, title: clampText(event.target.value, IDEA_LIMITS.title) }))}
                onBlur={handleBlur}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none"
                placeholder="What is this small mission called?"
              />
              <span className="mt-1 block text-xs text-slate-500">
                {titleCount} / {IDEA_LIMITS.title} characters
              </span>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Goal
              <textarea
                value={idea.goal}
                onChange={(event) => setIdea((prev) => ({ ...prev, goal: clampText(event.target.value, IDEA_LIMITS.goal) }))}
                onBlur={handleBlur}
                className="mt-2 h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none"
                placeholder="What tiny win would make you feel proud?"
              />
              <span className="mt-1 block text-xs text-slate-500">
                {goalCount} / {IDEA_LIMITS.goal} characters
              </span>
            </label>

            <label className="col-span-2 text-sm font-semibold text-slate-700">
              Mission
              <textarea
                value={idea.mission}
                onChange={(event) => setIdea((prev) => ({ ...prev, mission: clampText(event.target.value, IDEA_LIMITS.mission) }))}
                onBlur={handleBlur}
                className="mt-2 h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none"
                placeholder="Share one short sentence about what you are aiming to build."
              />
              <span className="mt-1 block text-xs text-slate-500">
                {missionCount} / {IDEA_LIMITS.mission} characters
              </span>
            </label>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Starter steps (up to {IDEA_LIMITS.steps})</h3>
              <span className="text-xs text-slate-500">Each step max {IDEA_LIMITS.stepLength} characters</span>
            </div>
            {idea.starterSteps.map((step, index) => (
              <input
                key={index}
                type="text"
                value={step}
                onChange={handleStepChange(index)}
                onBlur={handleBlur}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none"
                placeholder={`Step ${index + 1}`}
              />
            ))}
            <p className="text-xs text-slate-500">
              AI suggestions stay small, safe, and focused on tools you probably have nearby (paper, pencils, craft supplies).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IdeaStationPage;

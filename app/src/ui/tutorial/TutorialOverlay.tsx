import React, { useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useTutorial } from '../../runtime/hooks/useTutorial';
import { TUTORIALS } from './tutorialConfig';

const highlightClass = 'tutorial-highlight';

export const TutorialOverlay: React.FC = () => {
  const { tutorialState, nextStep, prevStep, completeTutorial } = useTutorial();
  const translation = useTranslation();
  const { activeTutorialId, currentStepIndex } = tutorialState;
  if (!activeTutorialId) return null;

  const steps = TUTORIALS[activeTutorialId] ?? [];
  if (steps.length === 0) return null;

  const step = steps[Math.min(currentStepIndex, steps.length - 1)];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex >= steps.length - 1;

  useEffect(() => {
    const targetElement = step?.targetElementId
      ? document.getElementById(step.targetElementId)
      : null;
    targetElement?.classList.add(highlightClass);
    return () => {
      targetElement?.classList.remove(highlightClass);
    };
  }, [step]);

  return (
    <aside
      className="pointer-events-none fixed inset-0 flex flex-col items-end gap-3 p-4"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto max-w-sm rounded-3xl border border-fuchsia-200 bg-slate-950/80 p-5 shadow-2xl shadow-fuchsia-800/40 text-sm text-slate-100"
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-description"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-300">
          {translation.tutorial.title}
        </p>
        <h2 id="tutorial-title" className="mt-2 text-2xl font-semibold text-white">
          {step.title}
        </h2>
        <p id="tutorial-description" className="mt-2 text-sm text-slate-300">
          {step.description}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          {translation.tutorial.stationLabel}{' '}
          <span className="text-white">{translation.stationNames[step.targetStationKey]}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => prevStep()}
            disabled={isFirst}
            className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          >
            {translation.tutorial.back}
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={() => nextStep(steps.length)}
              className="rounded-full border border-fuchsia-400 bg-fuchsia-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-fuchsia-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {translation.tutorial.next}
            </button>
          )}
          {isLast && (
            <button
              type="button"
              onClick={completeTutorial}
              className="rounded-full border border-emerald-400 bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {translation.tutorial.done}
            </button>
          )}
          <button
            type="button"
            onClick={completeTutorial}
            className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {translation.tutorial.skip}
          </button>
        </div>
      </div>
    </aside>
  );
};

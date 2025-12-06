import React from 'react';
import { useTutorial } from '../runtime/hooks/useTutorial';
import { useTranslation } from '../i18n/useTranslation';

const IdeaDock: React.FC = () => {
  const translation = useTranslation();
  const { stationNames, descriptions } = translation;
  const { startTutorial } = useTutorial();

  return (
    <section
      className="mx-auto max-w-4xl space-y-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-slate-900/10"
      aria-label={stationNames.idea}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Idea Station</p>
      <h1 className="text-3xl font-semibold text-slate-900">{stationNames.idea}</h1>
      <p className="text-sm text-slate-500">{descriptions.idea}</p>
      <button
        id="guided-mission-button"
        type="button"
        onClick={() => startTutorial('robot_dog_comic')}
        className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500 transition hover:bg-fuchsia-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
      >
        {translation.tutorial.buttonLabel}
      </button>
    </section>
  );
};

export default IdeaDock;

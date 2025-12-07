import React from 'react';

type StationIntroProps = {
  badge: string;
  title: string;
  description: string;
  tip?: string;
};

const StationIntro: React.FC<StationIntroProps> = ({ badge, title, description, tip }) => (
  <section
    className="mx-auto max-w-3xl space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/10"
    aria-label={`${badge} introduction`}
  >
    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{badge}</p>
    <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
    <p className="text-sm text-slate-600">{description}</p>
    {tip && <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{tip}</p>}
  </section>
);

export default StationIntro;

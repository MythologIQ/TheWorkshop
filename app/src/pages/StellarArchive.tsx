import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

const StellarArchivePage: React.FC = () => {
  const { stationNames, descriptions } = useTranslation();
  return (
    <section
      className="mx-auto max-w-4xl space-y-3 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-slate-900/10"
      aria-label={stationNames.memory}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Memory Station</p>
      <h1 className="text-3xl font-semibold text-slate-900">{stationNames.memory}</h1>
      <p className="text-sm text-slate-500">{descriptions.memory}</p>
    </section>
  );
};

export default StellarArchivePage;

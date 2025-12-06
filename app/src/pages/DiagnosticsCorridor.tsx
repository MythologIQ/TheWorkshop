import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

const DiagnosticsCorridorPage: React.FC = () => {
  const { stationNames, descriptions } = useTranslation();
  return (
    <section
      className="mx-auto max-w-4xl space-y-3 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-slate-900/10"
      aria-label={stationNames.test}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Test Station</p>
      <h1 className="text-3xl font-semibold text-slate-900">{stationNames.test}</h1>
      <p className="text-sm text-slate-500">{descriptions.test}</p>
    </section>
  );
};

export default DiagnosticsCorridorPage;

import React from 'react';

const DiagnosticsPage: React.FC = () => (
  <div className="p-6">
    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Diagnostics</p>
    <h1 className="text-3xl font-semibold text-slate-900">Adult Diagnostics</h1>
    <p className="mt-3 max-w-3xl text-sm text-slate-600">
      This space is designed for adults supporting kids in the MythologIQ Creation Lab. Check station visits,
      reset telemetry counters if needed, and coach children while the AI keeps suggestions gentle. The focus is on
      understanding usage and keeping everyone safe.
    </p>
  </div>
);

export default DiagnosticsPage;

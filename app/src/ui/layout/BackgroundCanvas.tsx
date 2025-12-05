import React from 'react';

// Simple decorative background for starship/hangar feel.
export const BackgroundCanvas: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.15),transparent_40%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.12),transparent_35%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(125,211,252,0.12),transparent_40%)]" />
  </div>
);

export default BackgroundCanvas;

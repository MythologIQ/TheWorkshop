import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import TopBar from './TopBar';
import StationNav from './StationNav';

type ShellLayoutProps = {
  children: React.ReactNode;
};

export const ShellLayout: React.FC<ShellLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <BackgroundCanvas />
    <TopBar />
    <div className="grid grid-cols-12 gap-4 px-4 py-4 lg:py-6">
      <aside className="col-span-12 lg:col-span-3 xl:col-span-2 rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <StationNav />
      </aside>
      <main className="col-span-12 lg:col-span-9 xl:col-span-10 rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur p-4 lg:p-6">
        {children}
      </main>
    </div>
  </div>
);

export default ShellLayout;

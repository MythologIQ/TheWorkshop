import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const stationRoutes = [
  { path: '/dock/idea', label: 'Design Dock' },
  { path: '/bay/build', label: 'Assembly Bay' },
  { path: '/corridor/test', label: 'Diagnostics Corridor' },
  { path: '/vault/memory', label: 'Stellar Archive' },
  { path: '/bridge/reflect', label: 'Orbiter Bridge' },
  { path: '/deck/share', label: 'Broadcast Deck' },
  { path: '/tunnels/replay', label: 'Time Tunnels' },
];

const adultRoutes = [
  { path: '/diagnostics', label: 'Diagnostics', note: 'For adults and mentors' },
  { path: '/insights', label: 'Adult Insights', note: 'Signals for caregivers' },
];

export const NavOverlay: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="flex flex-col gap-2 bg-slate-100 px-3 py-2 text-sm"
      aria-label="MythologIQ Creation Lab navigation"
    >
      <ul className="flex flex-wrap gap-3">
        {stationRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isActive
                    ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500'
                    : 'border-slate-300 text-slate-600 hover:border-fuchsia-400 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
        <span className="mr-2 font-semibold text-slate-700">Adults only</span>
        {adultRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive
                  ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500'
                  : 'border-slate-300 text-slate-600 hover:border-fuchsia-400 hover:text-slate-900'
              }`}
              title={route.note}
              aria-label={`${route.label} (adult use)`}
            >
              {route.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

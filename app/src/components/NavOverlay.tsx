import React from 'react';
import type { Translation } from '../i18n/translations';
import { Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTranslation } from '../i18n/useTranslation';

const navRoutes: { path: string; labelKey: keyof Translation['nav'] }[] = [
  { path: '/dock/idea', labelKey: 'designDock' },
  { path: '/bay/build', labelKey: 'assemblyBay' },
  { path: '/corridor/test', labelKey: 'diagnosticsCorridor' },
  { path: '/vault/memory', labelKey: 'stellarArchive' },
  { path: '/bridge/reflect', labelKey: 'orbiterBridge' },
  { path: '/deck/share', labelKey: 'broadcastDeck' },
  { path: '/tunnels/replay', labelKey: 'timeTunnels' },
  { path: '/settings', labelKey: 'settings' },
];

export const NavOverlay: React.FC = () => {
  const location = useLocation();
  const translation = useTranslation();
  const { preferences } = usePreferences();

  return (
    <nav className="bg-slate-100" aria-label="Station navigation">
      <ul className="mx-auto flex max-w-5xl flex-wrap gap-2 px-3 py-3">
        {navRoutes.map((route) => {
          const label = translation.nav[route.labelKey];
          const isActive = location.pathname === route.path;
          return (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`inline-flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 ${
                  isActive
                    ? 'border-fuchsia-500 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-fuchsia-400 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
                {preferences.extraLabels && (
                  <span className="text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400" aria-hidden="true">
                    Station {label}
                  </span>
                )}
                <span className="sr-only">{isActive ? ' (current station)' : ''}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

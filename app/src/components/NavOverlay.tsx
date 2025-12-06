import React, { useEffect } from 'react';
import type { StationKey } from '../domain/project';
import type { Translation } from '../i18n/translations';
import { Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../runtime/context/preferencesContext';
import { useTranslation } from '../i18n/useTranslation';
import { useTutorial } from '../runtime/hooks/useTutorial';
import { TUTORIALS } from '../ui/tutorial/tutorialConfig';
import { useTheme } from '../runtime/hooks/useTheme';
import { recordStationVisit } from '../runtime/store/telemetryStore';
import { useProfiles } from '../runtime/hooks/useProfiles';

const navRoutes: { path: string; labelKey: keyof Translation['nav']; stationKey?: StationKey }[] = [
  { path: '/dock/idea', labelKey: 'designDock', stationKey: 'idea' },
  { path: '/bay/build', labelKey: 'assemblyBay', stationKey: 'build' },
  { path: '/corridor/test', labelKey: 'diagnosticsCorridor', stationKey: 'test' },
  { path: '/vault/memory', labelKey: 'stellarArchive', stationKey: 'memory' },
  { path: '/bridge/reflect', labelKey: 'orbiterBridge', stationKey: 'reflect' },
  { path: '/deck/share', labelKey: 'broadcastDeck', stationKey: 'share' },
  { path: '/tunnels/replay', labelKey: 'timeTunnels', stationKey: 'replay' },
  { path: '/settings', labelKey: 'settings' },
  { path: '/diagnostics', labelKey: 'diagnostics' },
];

type NavOverlayProps = {
  onProfileSwitch?: () => void;
};

export const NavOverlay: React.FC<NavOverlayProps> = ({ onProfileSwitch }) => {
  const location = useLocation();
  const translation = useTranslation();
  const { preferences } = usePreferences();
  const { tutorialState } = useTutorial();
  const { theme } = useTheme();
  const { activeProfile } = useProfiles();
  const currentStep =
    tutorialState.activeTutorialId ? TUTORIALS[tutorialState.activeTutorialId]?.[tutorialState.currentStepIndex] : undefined;

  useEffect(() => {
    const match = navRoutes.find((route) => route.path === location.pathname);
    if (match?.stationKey) {
      recordStationVisit(match.stationKey);
    }
  }, [location.pathname]);

  return (
    <nav className={`${theme.palette.nav} ${theme.palette.text}`} aria-label="Station navigation">
      <ul className="mx-auto flex max-w-5xl flex-wrap gap-2 px-3 py-3">
        {navRoutes.map((route) => {
          const label = translation.nav[route.labelKey];
          const isActive = location.pathname === route.path;
          const isTutorialHighlight =
            !!currentStep && route.stationKey && currentStep.targetStationKey === route.stationKey;
          const linkId = route.stationKey ? `nav-${route.stationKey}` : `nav-${route.labelKey}`;
          return (
            <li key={route.path}>
              <Link
                to={route.path}
                id={linkId}
                className={`inline-flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 ${theme.palette.border} ${
                  isActive ? `${theme.palette.activeBg} ${theme.palette.activeText}` : `bg-white text-slate-600 hover:border-fuchsia-400 hover:text-slate-900`
                } ${isTutorialHighlight ? `ring-2 ${theme.palette.accent.replace('text-', 'ring-')} ring-offset-2` : ''}`}
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
        <li>
          <button
            type="button"
            onClick={onProfileSwitch}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 ${theme.palette.border} bg-white text-slate-600 hover:border-fuchsia-400 hover:text-slate-900`}
            aria-label={translation.profiles.switcherAria}
          >
            <span
              className="inline-flex h-3 w-3 rounded-full border border-slate-300"
              style={{ backgroundColor: activeProfile?.color ?? '#CBD5F5' }}
              aria-hidden="true"
            />
            {translation.profiles.switcherLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
};

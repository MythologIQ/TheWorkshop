import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import IdeaDock from './pages/IdeaDock';
import AssemblyBayPage from './pages/AssemblyBay';
import DiagnosticsCorridorPage from './pages/DiagnosticsCorridor';
import StellarArchivePage from './pages/StellarArchive';
import OrbiterBridgePage from './pages/OrbiterBridge';
import BroadcastDeckPage from './pages/BroadcastDeck';
import ReplayStationPage from './stations/replay/ReplayStationPage';
import SettingsPage from './pages/SettingsPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import { NavOverlay } from './components/NavOverlay';
import ProfileSelectionPage from './pages/ProfileSelectionPage';
import ProjectSelectionPage from './pages/ProjectSelectionPage';
import { TutorialOverlay } from './ui/tutorial/TutorialOverlay';
import { usePreferences } from './runtime/context/preferencesContext';
import { useProfiles } from './runtime/hooks/useProfiles';
import { useTheme } from './runtime/hooks/useTheme';
import { recordSession } from './runtime/store/telemetryStore';
import AdultInsightsPage from './pages/AdultInsightsPage';

const App: React.FC = () => {
  const { preferences } = usePreferences();
  const { theme } = useTheme();
  const { profiles, activeProfileId } = useProfiles();
  const [isProfileSelectionOpen, setProfileSelectionOpen] = useState(false);
  const [profileSelectionSource, setProfileSelectionSource] = useState<'gate' | 'manual'>('gate');
  const [hasSeenProfileGate, setHasSeenProfileGate] = useState(false);
  const fontClass = preferences.largerText ? 'text-lg' : 'text-base';
  const backgroundStyle = {
    backgroundImage: theme.backgroundGradient,
  };

  const openProfileSelection = (source: 'gate' | 'manual') => {
    setProfileSelectionSource(source);
    setProfileSelectionOpen(true);
  };

  const handleProfileSelectionComplete = () => {
    setProfileSelectionOpen(false);
    if (profileSelectionSource === 'gate') {
      setHasSeenProfileGate(true);
    }
  };

  useEffect(() => {
    const hasActiveProfile = profiles.some((profile) => profile.id === activeProfileId);
    const needsGate = profiles.length > 1 || !hasActiveProfile;
    if (!needsGate) {
      setProfileSelectionOpen(false);
      return;
    }
    if (!hasSeenProfileGate && !isProfileSelectionOpen) {
      openProfileSelection('gate');
    }
  }, [profiles, activeProfileId, hasSeenProfileGate, isProfileSelectionOpen]);

  useEffect(() => {
    recordSession();
  }, []);

  return (
    <>
      {isProfileSelectionOpen && (
        <ProfileSelectionPage onClose={handleProfileSelectionComplete} />
      )}
      <div
        className={`${fontClass} min-h-screen ${theme.palette.body} ${theme.palette.text}`}
        style={backgroundStyle}
        data-larger-font={preferences.largerText ? 'true' : 'false'}
      >
        <NavOverlay onProfileSwitch={() => openProfileSelection('manual')} />
        <TutorialOverlay />
        <main className="px-4 py-6" role="main" aria-label="Station content">
          <Routes>
            <Route path="/dock/idea" element={<IdeaDock />} />
            <Route path="/bay/build" element={<AssemblyBayPage />} />
            <Route path="/corridor/test" element={<DiagnosticsCorridorPage />} />
            <Route path="/vault/memory" element={<StellarArchivePage />} />
            <Route path="/bridge/reflect" element={<OrbiterBridgePage />} />
            <Route path="/deck/share" element={<BroadcastDeckPage />} />
            <Route path="/tunnels/replay" element={<ReplayStationPage />} />
            <Route path="/insights" element={<AdultInsightsPage />} />
            <Route path="/projects" element={<ProjectSelectionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="*" element={<IdeaDock />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;

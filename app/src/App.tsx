import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IdeaDock from './pages/IdeaDock';
import AssemblyBayPage from './pages/AssemblyBay';
import DiagnosticsCorridorPage from './pages/DiagnosticsCorridor';
import StellarArchivePage from './pages/StellarArchive';
import OrbiterBridgePage from './pages/OrbiterBridge';
import BroadcastDeckPage from './pages/BroadcastDeck';
import ReplayStationPage from './stations/replay/ReplayStationPage';
import SettingsPage from './pages/SettingsPage';
import { NavOverlay } from './components/NavOverlay';
import { usePreferences } from './runtime/context/preferencesContext';

const App: React.FC = () => {
  const { preferences } = usePreferences();
  const fontClass = preferences.largerText ? 'text-lg' : 'text-base';

  return (
    <div
      className={`${fontClass} min-h-screen bg-white text-slate-900`}
      data-larger-font={preferences.largerText ? 'true' : 'false'}
    >
      <NavOverlay />
      <main className="px-4 py-6" role="main" aria-label="Station content">
        <Routes>
          <Route path="/dock/idea" element={<IdeaDock />} />
          <Route path="/bay/build" element={<AssemblyBayPage />} />
          <Route path="/corridor/test" element={<DiagnosticsCorridorPage />} />
          <Route path="/vault/memory" element={<StellarArchivePage />} />
          <Route path="/bridge/reflect" element={<OrbiterBridgePage />} />
          <Route path="/deck/share" element={<BroadcastDeckPage />} />
          <Route path="/tunnels/replay" element={<ReplayStationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<IdeaDock />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IdeaDock from './pages/IdeaDock';
import AssemblyBayPage from './pages/AssemblyBay';
import DiagnosticsCorridorPage from './pages/DiagnosticsCorridor';
import StellarArchivePage from './pages/StellarArchive';
import OrbiterBridgePage from './pages/OrbiterBridge';
import BroadcastDeckPage from './pages/BroadcastDeck';
import TimeTunnelsPage from './pages/TimeTunnels';
import ProjectSelectionPage from './pages/ProjectSelectionPage';
import { NavOverlay } from './components/NavOverlay';

const App: React.FC = () => (
  <div className="min-h-screen bg-white text-slate-900">
    <NavOverlay />
    <Routes>
      <Route path="/" element={<ProjectSelectionPage />} />
      <Route path="/projects" element={<ProjectSelectionPage />} />
      <Route path="/dock/idea" element={<IdeaDock />} />
      <Route path="/bay/build" element={<AssemblyBayPage />} />
      <Route path="/corridor/test" element={<DiagnosticsCorridorPage />} />
      <Route path="/vault/memory" element={<StellarArchivePage />} />
      <Route path="/bridge/reflect" element={<OrbiterBridgePage />} />
      <Route path="/deck/share" element={<BroadcastDeckPage />} />
      <Route path="/tunnels/replay" element={<TimeTunnelsPage />} />
      <Route path="*" element={<IdeaDock />} />
    </Routes>
  </div>
);

export default App;

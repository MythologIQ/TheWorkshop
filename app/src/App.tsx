import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import IdeaDock from './pages/IdeaDock';
import AssemblyBayPage from './pages/AssemblyBay';
import DiagnosticsCorridorPage from './pages/DiagnosticsCorridor';
import StellarArchivePage from './pages/StellarArchive';
import OrbiterBridgePage from './pages/OrbiterBridge';
import BroadcastDeckPage from './pages/BroadcastDeck';
import TimeTunnelsPage from './pages/TimeTunnels';
import { ShellLayout } from './ui/layout/ShellLayout';
import { useProjectStore } from './stores/projectStore';
import { useUIStore } from './stores/uiStore';
import { stationByRoute } from './domain/stations';

const ProjectGate: React.FC = () => {
  const { projects, actions } = useProjectStore();
  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md rounded-2xl bg-white shadow-lg border border-slate-200 p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Welcome to The Workshop</h1>
        <p className="text-slate-600">
          Pick a project to enter the Stations. You can also create a starter mission.
        </p>
        <div className="flex justify-center gap-3">
          {hasProjects && (
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
              onClick={() => actions.setActive(projects[0].id)}
            >
              Open last project
            </button>
          )}
          {!hasProjects && (
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
              onClick={async () => {
                const proj = await actions.createProject('Starter Mission', 'A quick mission to get going.');
                actions.setActive(proj.id);
              }}
            >
              Create starter mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AppInner: React.FC = () => {
  const location = useLocation();
  const { activeStation, setActiveStation } = useUIStore();
  const { projects, activeProjectId } = useProjectStore();

  useEffect(() => {
    const station = stationByRoute(location.pathname);
    if (station && station.key !== activeStation) {
      setActiveStation(station.key);
    }
  }, [location.pathname, activeStation, setActiveStation]);

  if (!activeProjectId || projects.length === 0) {
    return <ProjectGate />;
  }

  return (
    <ShellLayout>
      <Routes>
        <Route path="/station/idea" element={<IdeaDock />} />
        <Route path="/station/build" element={<AssemblyBayPage />} />
        <Route path="/station/test" element={<DiagnosticsCorridorPage />} />
        <Route path="/station/memory" element={<StellarArchivePage />} />
        <Route path="/station/reflect" element={<OrbiterBridgePage />} />
        <Route path="/station/share" element={<BroadcastDeckPage />} />
        <Route path="/station/replay" element={<TimeTunnelsPage />} />
        <Route path="/" element={<Navigate to="/station/idea" replace />} />
        <Route path="*" element={<Navigate to="/station/idea" replace />} />
      </Routes>
    </ShellLayout>
  );
};

const App: React.FC = () => <AppInner />;

export default App;

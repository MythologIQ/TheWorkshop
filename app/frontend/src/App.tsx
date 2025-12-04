import React, { useState } from 'react';
import { DesignDock } from './idea-station/DesignDock';
import { AssemblyBay } from './build-station/AssemblyBay';
import { DiagnosticsCorridor } from './test-station/DiagnosticsCorridor';
import { StellarArchive } from './memory-station/StellarArchive';

type View = 'idea' | 'build' | 'test' | 'memory';

const App: React.FC = () => {
  const [view, setView] = useState<View>('idea');
  const [focusProjectId, setFocusProjectId] = useState<string | undefined>();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 12 }}>
      <header style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setView('idea')} disabled={view === 'idea'}>
          Design Dock
        </button>
        <button onClick={() => setView('build')} disabled={view === 'build'}>
          Assembly Bay
        </button>
        <button onClick={() => setView('test')} disabled={view === 'test'}>
          Diagnostics Corridor
        </button>
        <button onClick={() => setView('memory')} disabled={view === 'memory'}>
          Stellar Archive
        </button>
      </header>

      {view === 'idea' ? (
        <DesignDock
          onSaved={(projectId) => {
            setFocusProjectId(projectId);
            setView('build');
          }}
        />
      ) : view === 'build' ? (
        <AssemblyBay
          focusProjectId={focusProjectId}
          onGoToTest={(projectId) => {
            setFocusProjectId(projectId);
            setView('test');
          }}
        />
      ) : view === 'test' ? (
        <DiagnosticsCorridor
          focusProjectId={focusProjectId}
          onBackToBuild={(projectId) => {
            setFocusProjectId(projectId);
            setView('build');
          }}
          onGoToMemory={(projectId) => {
            setFocusProjectId(projectId);
            setView('memory');
          }}
        />
      ) : (
        <StellarArchive
          focusProjectId={focusProjectId}
          onBackToBuild={(projectId) => {
            setFocusProjectId(projectId);
            setView('build');
          }}
        />
      )}
    </div>
  );
};

export default App;
